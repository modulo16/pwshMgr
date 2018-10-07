param (
    [Parameter(Mandatory = $true)]
    [string] $ScriptID,
    [Parameter(Mandatory = $true)]
    [string] $MachineID
)


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

function ConvertTo-ScriptBlock {
    param ([string]$string)
    $scriptblock = $executioncontext.invokecommand.NewScriptBlock($string)
    return $scriptblock
}

$MachineData = Invoke-WebRequest -Uri "http://localhost:8080/api/machine/$MachineID" -UseBasicParsing -Headers $ApiHeaders
$MachineData = $MachineData.content | ConvertFrom-Json
$credentialID = $MachineData.credential

$credential = Invoke-WebRequest -Uri "http://localhost:8080/api/credential/$credentialID" -UseBasicParsing -Headers $ApiHeaders
$Credential = $Credential.Content | ConvertFrom-Json
$CredentialPwd = $credential.password | ConvertTo-SecureString -AsPlainText -Force
$CredentialUser = $credential.username
$Credential = New-Object -TypeName System.Management.Automation.PSCredential -ArgumentList $CredentialUser, $CredentialPwd


$return = Invoke-WebRequest -Method Get -Uri http://localhost:8080/api/script/$ScriptID -UseBasicParsing -Headers $ApiHeaders
$return = ConvertFrom-Json $return.Content



$return = ConvertTo-ScriptBlock -string $return.scriptBody



$parms = @{
    ComputerName = $MachineData.ipAddress
    ErrorAction  = "Stop"
    ScriptBlock  = $Return
    Credential   = $Credential
}

Invoke-Command @parms