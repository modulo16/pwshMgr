$ApiEndpoint = "http://localhost:8080/api"
$ApiCredentials = @{
    "email"    = "admin@admin.admin"
    "password" = "pwshmgradmin"
} | ConvertTo-Json

$Token = Invoke-WebRequest -Method Post -Uri "$ApiEndpoint/user/login" -Body $ApiCredentials -ContentType 'application/json' -UseBasicParsing
$Token = $Token.Content | ConvertFrom-Json | Select token
$ApiHeaders = @{
    "authorization" = "Bearer $($Token.token)"
}
Connect-Mdbc . pwshmgr machines
$Machines = Get-MdbcData

foreach ($Machine in $Machines) {
    $JobBlock = {
        param($Machine, $ApiHeaders)
        $ApiEndpoint = "http://localhost:8080/api"
        $ScriptBlock = {
            param($return)
            $publicip = Invoke-WebRequest -Uri ipinfo.io/ip -UseBasicParsing
            $publicip = $publicip.content
            $publicip = $publicip.Trim()
            $HostName = hostname
            $processes = Get-Process | Select-Object @{Name = "name"; Expr = {$_.ProcessName}}
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
                'type'            = $return.type
                'dateAdded'       = $return.dateAdded
                'physical'        = "Virtual"
                'credential'      = $return.credential
                'group'           = $return.group._id
                'drives'          = $Drives
                'status'          = "Online"
                'ipAddress'       = $return.ipAddress
                'processes'       = $processes
            }
            $computerProperties
        } #scriptblock end

        $Output = $Null
        $MachineData = $Machine
        if (Test-Connection -ComputerName $MachineData.ipAddress -bufferSize 4 -Count 1 -ErrorAction SilentlyContinue) {
            Write-Output "Machine is online"
        }
        else {

            write-output "Machine is offline - breaking"
            Invoke-WebRequest -Uri "$ApiEndpoint/machine/offline/$($MachineData._id)" -Headers $ApiHeaders -UseBasicParsing -Method Post
            Exit
        }
        $credentialID = $MachineData.credential
        $credential = Invoke-WebRequest -Uri "$ApiEndpoint/credential/$credentialID" -UseBasicParsing -Headers $ApiHeaders
        $Credential = $Credential.Content | ConvertFrom-Json
        $CredentialPwd = $credential.password | ConvertTo-SecureString -AsPlainText -Force
        $CredentialUser = $credential.username
        $Credential = New-Object -TypeName System.Management.Automation.PSCredential -ArgumentList $CredentialUser, $CredentialPwd
        $Output = Invoke-Command -ComputerName $MachineData.ipAddress -ScriptBlock $ScriptBlock -Credential $credential -ArgumentList $MachineData 
        $json = $Output | ConvertTo-Json -Compress
        Invoke-WebRequest -Uri "$ApiEndpoint/machine/$($Machine._id)" -Method Put -Body $json -UseBasicParsing -ContentType 'application/json'-Headers $ApiHeaders
        #if machine online end

    } #job block end


    $MachineId = $Machine._id
    Start-Job -ScriptBlock $JobBlock -ArgumentList $Machine, $ApiHeaders

} #foreach machine end

Get-Job | Wait-Job | Receive-Job

$AlertPolicies = Invoke-WebRequest -Uri "$ApiEndpoint/alertpolicy" -Headers $ApiHeaders -UseBasicParsing
$AlertPolicies = $AlertPolicies.Content | ConvertFrom-Json
$ActiveAlerts = Invoke-WebRequest -Uri "$ApiEndpoint/alert" -Headers $ApiHeaders -UseBasicParsing
$ActiveAlerts = $ActiveAlerts.Content | ConvertFrom-Json


foreach ($Policy in $AlertPolicies) {
    $ActiveAlert = $null
    if ($Policy.type -eq "drive") {
        $Machine = Invoke-WebRequest -Uri "$ApiEndpoint/machine/$($policy.machineId)" -UseBasicParsing -Headers $ApiHeaders
        $Machine = $Machine.Content | ConvertFrom-Json
        $DriveToCheck = $Machine.Drives | Where-Object {$_.name -eq $Policy.item}
        if ([Double]$DriveToCheck.freeGB -lt [Double]$Policy.threshold) {
            $AlertText = "$($DriveToCheck.name) drive on $($Machine.name) is below $($Policy.threshold)GB. Currently $($DriveToCheck.freeGB)GB"
            $AlertBody = @{
                'name'          = $AlertText
                'machineId'     = $Policy.machineId
                'alertPolicyId' = $Policy._id
                'priority'      = $Policy.priority
            } | ConvertTo-Json
            $ActiveAlert = $ActiveAlerts | Where-Object {($_.machineId -eq $Policy.machineId) -and ($_.alertPolicyId -eq $Policy._id)}
            if ($ActiveAlert) {
                Invoke-WebRequest -Uri "$ApiEndpoint/alert/$($ActiveAlert._id)" -Method Put -ContentType 'application/json' -UseBasicParsing -Headers $ApiHeaders
                Continue
            }

            Invoke-WebRequest -Uri "$ApiEndpoint/alert" -Method Post -Body $AlertBody -ContentType 'application/json' -UseBasicParsing -Headers $ApiHeaders
            $SlackIntegrations = Invoke-WebRequest -Uri "$ApiEndpoint/integration" -Headers $ApiHeaders -UseBasicParsing
            $SlackIntegrations = $SlackIntegrations.Content | ConvertFrom-Json
            foreach ($Slack in $SlackIntegrations) {
                $SlackPostBody = @{
                    'text' = $AlertText
                } | ConvertTo-Json
                Invoke-WebRequest -Uri $Slack.webHook -ContentType 'application/json' -Body $SlackPostBody -Method Post -UseBasicParsing -Headers $ApiHeaders
            }
        }
    }

    if ($Policy.type -eq "service") {
        $Machine = Invoke-WebRequest -Uri "$ApiEndpoint/machine/$($policy.machineId)" -UseBasicParsing -Headers $ApiHeaders
        $Machine = $Machine.Content | ConvertFrom-Json
        $ServiceToCheck = $Machine.services | ? {$_.displayName -eq $Policy.item}
        if ($ServiceToCheck.status -eq "Stopped") {
            $AlertText = """$($ServiceToCheck.displayName)"" service is stopped on ""$($Machine.name)"""
            $AlertBody = @{
                'name'          = $AlertText
                'machineId'     = $Policy.machineId
                'alertPolicyId' = $Policy._id
                'priority'      = $Policy.priority
            } | ConvertTo-Json
            $ActiveAlert = $ActiveAlerts | Where-Object {($_.machineId -eq $Policy.machineId) -and ($_.alertPolicyId -eq $Policy._id)}
            if ($ActiveAlert) {
                Invoke-WebRequest -Uri "$ApiEndpoint/alert/$($ActiveAlert._id)" -Method Put -ContentType 'application/json' -UseBasicParsing -Headers $ApiHeaders
                Continue
            }
            Invoke-WebRequest -Uri "$ApiEndpoint/alert" -Method Post -Body $AlertBody -ContentType 'application/json' -UseBasicParsing -Headers $ApiHeaders
            $SlackIntegrations = Invoke-WebRequest -Uri "$ApiEndpoint/integration" -Headers $ApiHeaders -UseBasicParsing
            $SlackIntegrations = $SlackIntegrations.Content | ConvertFrom-Json
            foreach ($Slack in $SlackIntegrations) {
                $SlackPostBody = @{ 'text' = $AlertText } | ConvertTo-Json
                Invoke-WebRequest -Uri $Slack.webHook -ContentType 'application/json' -Body $SlackPostBody -Method Post -UseBasicParsing -Headers $ApiHeaders
            }
        }
    }

    if ($Policy.type -eq "process" -And $Policy.threshold -eq "is-running") {
        $Machine = Invoke-WebRequest -Uri "$ApiEndpoint/machine/$($policy.machineId)" -UseBasicParsing -Headers $ApiHeaders
        $Machine = $Machine.Content | ConvertFrom-Json
        $Processes = $Machine.processes | Select-Object name
        foreach ($Process in $Processes) {
            if ($Process.name -eq $policy.item) {
                $AlertText = """$($policy.item)"" process is running on ""$($Machine.name)"""
                $AlertBody = @{
                    'name'          = $AlertText
                    'machineId'     = $Policy.machineId
                    'alertPolicyId' = $Policy._id
                    'priority'      = $Policy.priority
                } | ConvertTo-Json
                $ActiveAlert = $ActiveAlerts | Where-Object {($_.machineId -eq $Policy.machineId) -and ($_.alertPolicyId -eq $Policy._id)}
                if ($ActiveAlert) {
                    Invoke-WebRequest -Uri "$ApiEndpoint/alert/$($ActiveAlert._id)" -Method Put -ContentType 'application/json' -UseBasicParsing -Headers $ApiHeaders
                    Continue
                }
                Invoke-WebRequest -Uri "$ApiEndpoint/alert" -Method Post -Body $AlertBody -ContentType 'application/json' -UseBasicParsing -Headers $ApiHeaders
                $SlackIntegrations = Invoke-WebRequest -Uri "$ApiEndpoint/integration" -ContentType 'application/json' -UseBasicParsing -Headers $ApiHeaders
                $SlackIntegrations = $SlackIntegrations.Content | ConvertFrom-Json
                foreach ($Slack in $SlackIntegrations) {
                    $SlackPostBody = @{ 'text' = $AlertText } | ConvertTo-Json
                    Invoke-WebRequest -Uri $Slack.webHook -ContentType 'application/json' -Body $SlackPostBody -Method Post -UseBasicParsing -Headers $ApiHeaders
                }
                break
            }
        }
    }

    if ($Policy.type -eq "process" -And $Policy.threshold -eq "not-running") {
        #get machine
        $Machine = Invoke-WebRequest -Uri "$ApiEndpoint/machine/$($policy.machineId)" -UseBasicParsing -Headers $ApiHeaders
        $Machine = $Machine.Content | ConvertFrom-Json
        $Processes = $Machine.processes | Select-Object name
        foreach ($Process in $Processes) {
            if ($Process.name -eq $policy.item) {
                $running = $true 
            }
        }
        if (!$running) {
            $AlertText = """$($policy.item)"" process is not running on ""$($Machine.name)"""
            $AlertBody = @{
                'name'          = $AlertText
                'machineId'     = $Policy.machineId
                'alertPolicyId' = $Policy._id
                'priority'      = $Policy.priority
            } | ConvertTo-Json
            $ActiveAlert = $ActiveAlerts | Where-Object {($_.machineId -eq $Policy.machineId) -and ($_.alertPolicyId -eq $Policy._id)}
            if ($ActiveAlert) {
                Invoke-WebRequest -Uri "$ApiEndpoint/alert/$($ActiveAlert._id)" -Method Put -ContentType 'application/json' -UseBasicParsing -Headers $ApiHeaders
                Continue
            }
            Invoke-WebRequest -Uri "$ApiEndpoint/alert" -Method Post -Body $AlertBody -ContentType 'application/json' -UseBasicParsing -Headers $ApiHeaders
        } 
        else {
            $running = $null
        }
    }
}