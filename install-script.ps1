# add requires admin here
$ErrorActionPreference = "Stop"

# Enable TLS 1.2 since it is required for certain HTTPS connections
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

# Create pwshMgr Folder + temp install
$PwshMgrDirectory = "$env:SystemDrive\pwshMgr"
New-Item -ItemType Directory -Path "$PwshMgrDirectory"
New-Item -ItemType Directory -Path "$PwshMgrDirectory\temp"

# Download and install PowerShell Core 6.1.0
Invoke-WebRequest -Uri "https://github.com/PowerShell/PowerShell/releases/download/v6.1.0/PowerShell-6.1.0-win-x64.msi" -OutFile "$PwshMgrDirectory\temp\PowerShell-6.1.0-win-x64.msi" -UseBasicParsing
Start-Process msiexec -ArgumentList "/qb /i $PwshMgrDirectory\temp\PowerShell-6.1.0-win-x64.msi" -Wait

# Download and install MongoDB 4.0.3 Community
Invoke-WebRequest -Uri "https://fastdl.mongodb.org/win32/mongodb-win32-x86_64-2008plus-ssl-4.0.3-signed.msi" -OutFile "$PwshMgrDirectory\temp\mongodb-win32-x86_64-2008plus-ssl-4.0.3-signed.msi" -UseBasicParsing
Start-Process msiexec -ArgumentList "/qb /i $PwshMgrDirectory\temp\mongodb-win32-x86_64-2008plus-ssl-4.0.3-signed.msi ADDLOCAL=""Server,ServerService,Client"" SHOULD_INSTALL_COMPASS=""0""" -Wait

# Download and install Node.js 10.12.0
Invoke-WebRequest -Uri "https://nodejs.org/dist/v10.12.0/node-v10.12.0-x64.msi" -OutFile "$PwshMgrDirectory\temp\node-v10.12.0-x64.msi" -UseBasicParsing
Start-Process msiexec -ArgumentList "/qb /i $PwshMgrDirectory\temp\node-v10.12.0-x64.msi" -Wait

# Determine latest pwshMgr release via GitHub API
$latest_release_uri = "https://api.github.com/repos/pwshMgr/pwshMgr/releases/latest"
$latest_release_json = Invoke-WebRequest -Uri $latest_release_uri
$latest_release = ($latest_release_json | ConvertFrom-Json).tag_name

# Download latest pwshMgr release
$zip_file = "$PwshMgrDirectory\$latest_release.zip"
$download_uri = "https://github.com/pwshMgr/pwshMgr/archive/$latest_release.zip"
Invoke-WebRequest -Uri $download_uri -OutFile $zip_file

# Extract zip file
Expand-Archive -Path $zip_file -DestinationPath $PwshMgrDirectory -Force
$version = $latest_release.Substring(1)

# Install Node Modules
Start-Process "$env:ProgramFiles\nodejs\npm.cmd" -ArgumentList "install" -WorkingDirectory "$PwshMgrDirectory\pwshMgr-$version"

# Create .env file
New-Item -ItemType File -Path "$PwshMgrDirectory\pwshMgr-$version\.env"

# Generate JWT secret key and add to .env file
Add-Type -AssemblyName System.Security
[Reflection.Assembly]::LoadWithPartialName("System.Security")
$rijndael = new-Object System.Security.Cryptography.RijndaelManaged
$rijndael.GenerateKey()
$key = ([System.BitConverter]::ToString($rijndael.Key).Replace("-", "").ToLowerInvariant())
Write-Output "JWTSECRET=$key" | Out-File "$PwshMgrDirectory\pwshMgr-$version\.env" -Append
$rijndael.Dispose()

# Add database path to .env file
Write-Output "MONGODBPATH=mongodb://localhost:27017/pwshmgr`r`nJWTSECRET=9236749763248723646238764iasgd" | Out-File -Encoding ascii -NoClobber "$PwshMgrDirectory\pwshMgr-$version\.env" -NoNewline

# Download NSSM and extract
Invoke-WebRequest -Uri "https://nssm.cc/release/nssm-2.24.zip" -OutFile "$PwshMgrDirectory\temp\nssm-2.24.zip" -UseBasicParsing
Expand-Archive -Path "$PwshMgrDirectory\temp\nssm-2.24.zip" -DestinationPath $PwshMgrDirectory -Force
Copy-Item -Path "$PwshMgrDirectory\nssm-2.24\win64\nssm.exe" -Destination "$PwshMgrDirectory\pwshMgr-$version\nssm.exe"
Invoke-Expression "$PwshMgrDirectory\pwshMgr-$version\nssm.exe install pwshmgr ""$env:SystemDrive\Program Files\nodejs\node.exe"" ""$PwshMgrDirectory\pwshMgr-$version\index.js"""
Invoke-Expression "$PwshMgrDirectory\pwshMgr-$version\nssm.exe set pwshmgr AppDirectory ""$PwshMgrDirectory\pwshMgr-$version"""
Start-Service -Name pwshmgr