# pwshMgr

### PowerShell based Management and Monitoring Portal

## Status

Under development.

This project is in very early stages and is not suitable for production environments.

I am looking for testers, so please get in touch if interested: pwshmgr@gmail.com

## Install with PowerShell

```powershell
iex ((New-Object System.Net.WebClient).DownloadString('https://raw.githubusercontent.com/pwshMgr/pwshMgr/master/install.ps1'))
```

## Current Features
* Monitor Windows Server/Desktops agentless via WinRM. Machines are polled every 10 minutes
* Run scripts
* Install apps from the public Chocolatey repository
* View information on machines including applications, running processes, disk space usage and availability
* Generate alerts and send to Slack via webhook

## Stack
* NodeJS 10.11.0
* MongoDB 4.0.2
* Angular 6
* Socket.IO
* Powershell

--------------
#### Machines
![Imgur](https://i.imgur.com/OOaJbDO.png)

#### Machine details
![Imgur](https://i.imgur.com/qSSLAzy.png)

#### Active Alerts
![Imgur](https://i.imgur.com/2WikTyZ.png)

#### Running job
![Imgur](https://i.imgur.com/EcyXFJl.png)

## Planned
* Package into installable executable
* Switch to PowerShell Core so it can run on Linux
* Ability to schedule scripts
* Ability to add machines to groups so jobs and alert policies can be created against multiple machines
* PagerDuty Integration
* Email Integration