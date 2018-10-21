$StopWatch = [System.Diagnostics.Stopwatch]::startNew()
$ApiEndpoint = "http://localhost:8080/api"
$ApiCredentials = @{
    "email"    = "admin@admin.admin"
    "password" = "pwshmgradmin"
} | ConvertTo-Json

$Token = Invoke-WebRequest -Method Post -Uri "$ApiEndpoint/users/login" -Body $ApiCredentials -ContentType 'application/json' -UseBasicParsing
$Token = $Token.Content | ConvertFrom-Json | Select-Object token
$ApiHeaders = @{
    "authorization" = "Bearer $($Token.token)"
}

$Functions = {
    Function Get-PwshMgrCredential {
        Param(
            [Parameter(Mandatory = $true)][String]$ID
        )
        $C = Invoke-WebRequest -Uri "$ApiEndpoint/credentials/$ID" -UseBasicParsing -Headers $ApiHeaders
        $C = $C.Content | ConvertFrom-Json
        $CPwd = $C.password | ConvertTo-SecureString -AsPlainText -Force
        $CUser = $C.username
        $C = New-Object -TypeName System.Management.Automation.PSCredential -ArgumentList $CUser, $CPwd
        Return $C
    }
    
    Function Send-ToSlack {
        Param(
            [Parameter(Mandatory = $true)][String]$ID,
            [Parameter(Mandatory = $true)][String]$AlertText
        )
        $SlackData = Invoke-WebRequest -Uri "$ApiEndpoint/integrations/$ID" -Method Get -UseBasicParsing -Headers $ApiHeaders
        $SlackData = $SlackData.Content | ConvertFrom-Json
        $SlackPostBody = @{
            'text' = $AlertText
        } | ConvertTo-Json
        Invoke-WebRequest -Uri $SlackData.webHook -ContentType 'application/json' -Body $SlackPostBody -Method Post -UseBasicParsing
    }

    Function New-PwshMgrAlert {
        Param(
            [Parameter(Mandatory = $true)][System.Object]$Policy,
            [Parameter(Mandatory = $true)][String]$AlertText
        )
        $AlertBody = @{
            'name'          = $AlertText
            'machineId'     = $Policy.machineId
            'alertPolicyId' = $Policy._id
            'priority'      = $Policy.priority
        } | ConvertTo-Json
        Invoke-WebRequest -Uri "$ApiEndpoint/alerts" -Method Post -Body $AlertBody -ContentType 'application/json' -UseBasicParsing -Headers $ApiHeaders
    }
}

$Machines = Invoke-WebRequest -Uri "$ApiEndpoint/machines" -Headers $ApiHeaders -UseBasicParsing
$Machines = $Machines.Content | ConvertFrom-Json
$AlertPolicies = Invoke-WebRequest -Uri "$ApiEndpoint/alertpolicies" -Headers $ApiHeaders -UseBasicParsing
$AlertPolicies = $AlertPolicies.Content | ConvertFrom-Json
$ActiveAlerts = Invoke-WebRequest -Uri "$ApiEndpoint/alerts" -Headers $ApiHeaders -UseBasicParsing
$ActiveAlerts = $ActiveAlerts.Content | ConvertFrom-Json

foreach ($Machine in $Machines) {
    $JobBlock = {
        param($Machine, $ApiHeaders, $ApiEndpoint, $AlertPolicies, $ActiveAlerts)
        $ScriptBlock = {
            param($return)
            $publicip = Invoke-WebRequest -Uri ipinfo.io/ip -UseBasicParsing | Select-Object $_.Content
            $publicip = $publicip.content
            $publicip = $publicip.Trim()
            $HostName = hostname
            $processes = Get-Process | Select-Object @{Name = "name"; Expr = {$_.ProcessName}}, @{Name = "pId"; Expr = {$_.Id}}
            $domain = (Get-WmiObject Win32_ComputerSystem).Domain
            $Services = Get-Service | Select-Object @{Name = "displayName"; Expr = {$_.DisplayName}}, @{Name = "status"; Expr = {$_.Status}} | ConvertTo-Csv | ConvertFrom-Csv
            $OSDetails = Get-CimInstance Win32_OperatingSystem 
            $Drives = Get-PSDrive -PSProvider FileSystem | 
                Select-Object @{Name = "name"; Expr = {$_.Name}}, @{Name = "usedGB"; Expr = {[math]::Round($_.Used / 1GB, 2)}}, @{Name = "freeGB"; Expr = {[math]::Round($_.Free / 1GB, 2)}} | 
                ConvertTo-Csv | ConvertFrom-Csv
            $SerialNumber = Get-CimInstance win32_bios
            $Applications = Get-ItemProperty HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\* |
                Where-Object {$_.DisplayName -ne $null} |
                Select-Object @{Name = "name"; Expr = {$_.DisplayName}}, @{Name = "version"; Expr = {$_.DisplayVersion}}
            $MakeModel = Get-CimInstance Win32_ComputerSystemProduct
            $computerProperties = @{
                'name'            = $HostName
                'operatingSystem' = $osDetails.Caption
                'architecture'    = $osDetails.OSArchitecture
                'serialNumber'    = $serialnumber.SerialNumber
                'applications'    = $Applications
                'make'            = $makemodel.Vendor
                'model'           = $makemodel.Version
                'publicIp'        = $publicip
                'domain'          = $domain
                'services'        = $Services
                'drives'          = $Drives
                'status'          = "Online"
                'processes'       = $processes
            }
            $computerProperties
        } #scriptblock end

        if (Test-Connection -ComputerName $Machine.ipAddress -bufferSize 4 -Count 1 -ErrorAction SilentlyContinue) {
            Write-Output "Machine is online"
        }
        else {
            write-output "Machine is offline - breaking"
            Invoke-WebRequest -Uri "$ApiEndpoint/machines/offline/$($Machine._id)" -Headers $ApiHeaders -UseBasicParsing -Method Post | Out-Null
            Exit
        }

        $Credential = Get-PwshMgrCredential -ID $Machine.credential

        Try {
        Write-Output "attempting WINRM on $($Machine.name)"
            $Output = Invoke-Command -ComputerName $Machine.ipAddress -ScriptBlock $ScriptBlock -Credential $credential -ArgumentList $Machine -ErrorAction Stop
        }
        Catch {   
            Write-Error "failed to connect to WINRM on $($Machine.name)"
            Invoke-WebRequest -Uri "$ApiEndpoint/machines/winrmfailed/$($Machine._id)" -Headers $ApiHeaders -UseBasicParsing -Method Post | Out-Null
            Break
        }
        
        $json = $Output | ConvertTo-Json -Compress

        Invoke-WebRequest -Uri "$ApiEndpoint/machines/$($Machine._id)" -Method Put -Body $json -UseBasicParsing -ContentType 'application/json'-Headers $ApiHeaders | Out-Null
        foreach ($Policy in $AlertPolicies | Where-Object {$_.machineId -eq $($Machine._id)}) {
            $ActiveAlert = $null
            if ($Policy.type -eq "drive") {
                $DriveToCheck = $output.drives | Where-Object {$_.name -eq $Policy.item}
                if ([Double]$DriveToCheck.freeGB -lt [Double]$Policy.threshold) {
                    $ActiveAlert = $ActiveAlerts | Where-Object {($_.machineId -eq $Policy.machineId) -and ($_.alertPolicyId -eq $Policy._id)}
                    if ($ActiveAlert) {
                        Invoke-WebRequest -Uri "$ApiEndpoint/alerts/$($ActiveAlert._id)" -Method Put -ContentType 'application/json' -UseBasicParsing -Headers $ApiHeaders
                        Continue
                    }
                    $AlertText = "$($DriveToCheck.name) drive on $($output.name) is below $($Policy.threshold)GB. Currently $($DriveToCheck.freeGB)GB"
                    New-PwshMgrAlert -Policy $Policy -AlertText $AlertText
                    foreach ($Slack in $Policy.integrations) {
                        Send-ToSlack -ID $Slack -AlertText $AlertText
                    }
                }
            }
            if ($Policy.type -eq "service") {
                $Machine = Invoke-WebRequest -Uri "$ApiEndpoint/machines/$($policy.machineId)" -UseBasicParsing -Headers $ApiHeaders
                $Machine = $Machine.Content | ConvertFrom-Json
                $ServiceToCheck = $output.services | Where-Object {$_.displayName -eq $Policy.item}
                if ($ServiceToCheck.status -eq "Stopped") {
                    $ActiveAlert = $ActiveAlerts | Where-Object {($_.machineId -eq $Policy.machineId) -and ($_.alertPolicyId -eq $Policy._id)}
                    if ($ActiveAlert) {
                        Invoke-WebRequest -Uri "$ApiEndpoint/alerts/$($ActiveAlert._id)" -Method Put -ContentType 'application/json' -UseBasicParsing -Headers $ApiHeaders
                        Continue
                    }
                    $AlertText = """$($ServiceToCheck.displayName)"" service is stopped on ""$($output.name)"""
                    New-PwshMgrAlert -Policy $Policy -AlertText $AlertText
                    foreach ($Slack in $Policy.integrations) {
                        Send-ToSlack -ID $Slack -AlertText $AlertText
                    }
                }
            }
            if ($Policy.type -eq "process" -And $Policy.threshold -eq "is-running") {
                $Processes = $output.processes | Select-Object name
                foreach ($Process in $Processes) {
                    if ($Process.name -eq $policy.item) {
                        $ActiveAlert = $ActiveAlerts | Where-Object {($_.machineId -eq $Policy.machineId) -and ($_.alertPolicyId -eq $Policy._id)}
                        if ($ActiveAlert) {
                            Invoke-WebRequest -Uri "$ApiEndpoint/alerts/$($ActiveAlert._id)" -Method Put -ContentType 'application/json' -UseBasicParsing -Headers $ApiHeaders
                            Continue
                        }
                        $AlertText = """$($policy.item)"" process is running on ""$($output.name)"""
                        New-PwshMgrAlert -Policy $Policy -AlertText $AlertText
                        foreach ($Slack in $Policy.integrations) {
                            Send-ToSlack -ID $Slack -AlertText $AlertText
                        }
                        break
                    }
                }
            }
            if ($Policy.type -eq "process" -And $Policy.threshold -eq "not-running") {
                $Processes = $output.processes | Select-Object name
                foreach ($Process in $Processes) {
                    if ($Process.name -eq $policy.item) {
                        $running = $true 
                    }
                }
                if (!$running) {
                    $ActiveAlert = $ActiveAlerts | Where-Object {($_.machineId -eq $Policy.machineId) -and ($_.alertPolicyId -eq $Policy._id)}
                    if ($ActiveAlert) {
                        Invoke-WebRequest -Uri "$ApiEndpoint/alerts/$($ActiveAlert._id)" -Method Put -ContentType 'application/json' -UseBasicParsing -Headers $ApiHeaders
                        Continue
                    }
                    $AlertText = """$($policy.item)"" process is not running on ""$($output.name)"""
                    New-PwshMgrAlert -Policy $Policy -AlertText $AlertText
                    foreach ($Slack in $Policy.integrations) {
                        Send-ToSlack -ID $Slack -AlertText $AlertText
                    }
                } 
                else {
                    $running = $null
                }
            }
        } #if machine online end

    } #job block end

    Start-Job -ScriptBlock $JobBlock -ArgumentList $Machine, $ApiHeaders, $ApiEndpoint, $AlertPolicies, $ActiveAlerts -InitializationScript $Functions

} #foreach machine end

Get-Job | Wait-Job | Receive-Job
$StopWatch.Stop()
$StopWatch.Elapsed