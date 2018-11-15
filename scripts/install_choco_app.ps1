param (
    [Parameter(Mandatory = $true)]
    [string] $MachineID,
    [Parameter(Mandatory = $true)]
    [string] $JobID,
    [Parameter(Mandatory = $true)]
    [string] $ApiPwd
)

$ApiEndpoint = "http://localhost:8080/api"
$ApiCredentials = @{
    "email" = "admin@admin.admin"
    "password" = $ApiPwd
} | ConvertTo-Json

$Token = Invoke-WebRequest -Method Post -Uri "$ApiEndpoint/users/login" -Body $ApiCredentials -ContentType 'application/json' -UseBasicParsing
$Token = $Token.Content | ConvertFrom-Json | Select token
$ApiHeaders = @{
    "authorization" = "Bearer $($Token.token)"
}

$MachineData = Invoke-WebRequest -Uri "$ApiEndpoint/machines/$MachineID" -UseBasicParsing -Headers $ApiHeaders
$MachineData = $MachineData.content | ConvertFrom-Json
$credentialID = $MachineData.credential

$credential = Invoke-WebRequest -Uri "$ApiEndpoint/credentials/$credentialID" -UseBasicParsing -Headers $ApiHeaders
$Credential = $Credential.Content | ConvertFrom-Json
$CredentialPwd = $credential.password | ConvertTo-SecureString -AsPlainText -Force
$CredentialUser = $credential.username
$Credential = New-Object -TypeName System.Management.Automation.PSCredential -ArgumentList $CredentialUser, $CredentialPwd

$JobData = Invoke-WebRequest -Uri "$ApiEndpoint/jobs/$JobID" -UseBasicParsing -Headers $ApiHeaders
$JobData = $JobData.content | ConvertFrom-Json

$parms = @{
    ComputerName = $MachineData.name
    ErrorAction  = "Stop"
    ArgumentList = $JobData.application
    Credential   = $Credential
}

Invoke-Command @parms { 
    $ChocoApp = $args[0]
    $Output = & choco install $ChocoApp -y
    $Output
}