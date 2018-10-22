﻿#Requires -RunAsAdministrator
$ErrorActionPreference = "Stop"

# Enable TLS 1.2 since it is required for certain HTTPS connections
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

# Create pwshMgr Folder & temp install
$PwshMgrDirectory = "$env:SystemDrive\pwshMgr"
New-Item -ItemType Directory -Path "$PwshMgrDirectory"
New-Item -ItemType Directory -Path "$PwshMgrDirectory\temp"

# Determine latest pwshMgr release via GitHub API
$Release = Invoke-WebRequest -Uri "https://api.github.com/repos/pwshMgr/pwshMgr/releases/latest"
$Release = ($Release | ConvertFrom-Json).tag_name
$Version = $Release.Substring(1)

#Download & install PowerShell Core 6.1.0
Write-Output "Download & install PowerShell Core 6.1.0"
$Params = @{
    Uri = "https://github.com/PowerShell/PowerShell/releases/download/v6.1.0/PowerShell-6.1.0-win-x64.msi"
    OutFile = "$PwshMgrDirectory\temp\PowerShell-6.1.0-win-x64.msi"
    UseBasicParsing = $True
}
Invoke-WebRequest @Params

$Params = @{
    FilePath = "msiexec"
    ArgumentList = "/qb /i $PwshMgrDirectory\temp\PowerShell-6.1.0-win-x64.msi"
    Wait = $True
}
Start-Process @Params

# Download & install MongoDB 4.0.3 Community
Write-Output "Download & install MongoDB 4.0.3 Community"
$Params = @{
    Uri = "https://fastdl.mongodb.org/win32/mongodb-win32-x86_64-2008plus-ssl-4.0.3-signed.msi"
    OutFile = "$PwshMgrDirectory\temp\mongodb-win32-x86_64-2008plus-ssl-4.0.3-signed.msi"
    UseBasicParsing = $True
}
Invoke-WebRequest @Params

$Params = @{
    FilePath = "msiexec"
    ArgumentList = "/qb /i $PwshMgrDirectory\temp\mongodb-win32-x86_64-2008plus-ssl-4.0.3-signed.msi" +
                    " ADDLOCAL=""Server,ServerService,Client"" SHOULD_INSTALL_COMPASS=""0"""
    Wait = $True
}
Start-Process @Params


# Download & install Node.js 10.12.0
Write-Output "Download & install Node.js 10.12.0"
$Params = @{
    Uri = "https://nodejs.org/dist/v10.12.0/node-v10.12.0-x64.msi"
    OutFile = "$PwshMgrDirectory\temp\node-v10.12.0-x64.msi"
    UseBasicParsing = $True
}
Invoke-WebRequest @Params

$Params = @{
    FilePath = "msiexec"
    ArgumentList = "/qb /i $PwshMgrDirectory\temp\node-v10.12.0-x64.msi"
    Wait = $True
}
Start-Process @Params

# Download latest pwshMgr release
Write-Output "Download latest pwshMgr release - $Release"
$Params = @{
    Uri = "https://github.com/pwshMgr/pwshMgr/archive/$Release.zip"
    OutFile = "$PwshMgrDirectory\$Release.zip"
    UseBasicParsing = $True
}
Invoke-WebRequest @Params

# Extract latest pwshMgr release
Write-Output "Extracting latest pwshMgr release - $Release"
Expand-Archive -Path $zip_file -DestinationPath $PwshMgrDirectory -Force

# Install Node Modules
Write-Output "Installing Node.js modules"
$Params = @{
    FilePath = "$env:ProgramFiles\nodejs\npm.cmd"
    ArgumentList = "install"
    WorkingDirectory = "$PwshMgrDirectory\pwshMgr-$version"
    Wait = $True
}
Start-Process @Params

# Create .env file
New-Item -ItemType File -Path "$PwshMgrDirectory\pwshMgr-$version\.env"

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
"$AdmPwd" | Out-File -Encoding ascii -NoClobber "$PwshMgrDirectory\pwshMgr-$version\.env" -NoNewline

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
Expand-Archive -Path "$PwshMgrDirectory\temp\nssm-2.24.zip" -DestinationPath $PwshMgrDirectory -Force
Copy-Item -Path "$PwshMgrDirectory\nssm-2.24\win64\nssm.exe" -Destination "$PwshMgrDirectory\pwshMgr-$version\nssm.exe"

# Run command to setup Windows Service
Write-Output "Installing Windows Service"
$InstallService = "$PwshMgrDirectory\pwshMgr-$version\nssm.exe" +
" install pwshmgr ""$env:SystemDrive\Program Files\nodejs\node.exe""" +
" ""$PwshMgrDirectory\pwshMgr-$version\index.js"""
Invoke-Expression $InstallService

# Run command to configure Windows Service
Write-Output "Configuring Windows Service"
$SetService = "$PwshMgrDirectory\pwshMgr-$version\nssm.exe" + 
" set pwshmgr AppDirectory ""$PwshMgrDirectory\pwshMgr-$version"""
Invoke-Expression $SetService

# Set Trusted Hosts
Write-Output "Setting trusted hosts to *"
Set-Item -Path WSMan:\localhost\Client\TrustedHosts -Value "*" -Force

# Start Service
Start-Service -Name pwshmgr

#Finish
Write-Output "Script Finished"
Write-Output "Navigate to http://$($env:COMPUTERNAME):8080"
Write-Output "Login with username: admin@admin.admin"
Write-Output "Password: $AdmPwd (take note of this password)"
Pause