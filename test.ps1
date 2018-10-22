# Generate JWT secret key
Add-Type -AssemblyName System.Security
[Reflection.Assembly]::LoadWithPartialName("System.Security")
$Rijndael = new-Object System.Security.Cryptography.RijndaelManaged
$Rijndael.GenerateKey()
$Key = ([System.BitConverter]::ToString($Rijndael.Key).Replace("-", "").ToLowerInvariant())
$Rijndael.Dispose()

## Generate Admin password
$AdmPwd = -join ((48..57) + (97..122) | Get-Random -Count 12 | % {[char]$_})

# Add database path to .env file
$DotEnv = "MONGODBPATH=mongodb://localhost:27017/pwshmgr" +
"`r`nJWTSECRET=$Key`r`nADMINPW=" + 
"$AdmPwd" | Out-File -Encoding ascii -NoClobber "$PwshMgrDir\pwshMgr-$version\.env" -NoNewline

# Download NSSM
Write-Output "Download NSSM"
$Params = @{
    Uri = "https://nssm.cc/release/nssm-2.24.zip"
    OutFile = "$PwshMgrDirectory\temp\nssm-2.24.zip"
    UseBasicParsing = $True
}
Invoke-WebRequest @Params

# Extract NSSM and copy to application directory
Write-Output "Extract NSSM"
Expand-Archive -Path "$PwshMgrDir\temp\nssm-2.24.zip" -DestinationPath $PwshMgrDir -Force
Copy-Item -Path "$PwshMgrDir\nssm-2.24\win64\nssm.exe" -Destination "$PwshMgrDir\pwshMgr-$version\nssm.exe"

# Run command to setup Windows Service
Write-Output "Installing Windows Service"
$InstallService = "$PwshMgrDir\pwshMgr-$version\nssm.exe" +
" install pwshmgr ""$env:SystemDrive\Program Files\nodejs\node.exe""" +
" ""$PwshMgrDir\pwshMgr-$version\index.js"""
Invoke-Expression $InstallService

# Run command to configure Windows Service
Write-Output "Configuring Windows Service"
$SetService = "$PwshMgrDir\pwshMgr-$version\nssm.exe" + 
" set pwshmgr AppDirectory ""$PwshMgrDir\pwshMgr-$version"""
Invoke-Expression $SetService

# Set Trusted Hosts
Write-Output "Setting trusted hosts to *"
Set-Item -Path WSMan:\localhost\Client\TrustedHosts -Value "*" -Force

# Open TCP 8080 inbound
$Params = @{
    DisplayName = 'pwshMgr Web Portal Inbound'
    Profile = @('Domain', 'Private', 'Public')
    Direction = "Inbound"
    Action = "Allow"
    Protocol = "TCP"
    LocalPort = "8080"
}
New-NetFirewallRule @Params

# Start Service
Start-Service -Name pwshmgr

#Finish
Write-Output "Script Finished"
Write-Output "Navigate to http://$($env:COMPUTERNAME):8080"
Write-Output "Login with username: admin@admin.admin"
Write-Output "Password: $AdmPwd (take note of this password)"
Pause