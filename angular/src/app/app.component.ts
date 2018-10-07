import { Component } from '@angular/core';
import { PageHeaderComponent} from './page-header/page-header.component'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  variable: any
  title = 'Asset Management';
  machine = {
    "SerialNumber":  "1042540800014",
    "ComputerName":  "DESKTOP-LCUAGUG",
    "Applications":  [
                         {
                             "DisplayName":  "Adobe AIR",
                             "DisplayVersion":  "29.0.0.112"
                         },
                         {
                             "DisplayName":  "Adobe Flash Player 29 NPAPI",
                             "DisplayVersion":  "29.0.0.171"
                         },
                         {
                             "DisplayName":  "Audacity 2.2.0",
                             "DisplayVersion":  "2.2.0"
                         },
                         {
                             "DisplayName":  "Cisco AnyConnect Secure Mobility Client ",
                             "DisplayVersion":  "4.3.02039"
                         },
                         {
                             "DisplayName":  "Citrix Receiver 4.10",
                             "DisplayVersion":  "14.10.1.22"
                         },
                         {
                             "DisplayName":  "CrystalDiskInfo 7.5.2",
                             "DisplayVersion":  "7.5.2"
                         },
                         {
                             "DisplayName":  "Google Chrome",
                             "DisplayVersion":  "66.0.3359.181"
                         },
                         {
                             "DisplayName":  "ImgBurn",
                             "DisplayVersion":  "2.5.8.0"
                         },
                         {
                             "DisplayName":  "Security Update for CAPICOM (KB931906)",
                             "DisplayVersion":  "2.1.0.2"
                         },
                         {
                             "DisplayName":  "LAME v3.99.3 (for Windows)",
                             "DisplayVersion":  null
                             
                         },
                         {
                             "DisplayName":  "qBittorrent 3.3.16",
                             "DisplayVersion":  "3.3.16"
                         },
                         {
                             "DisplayName":  "Robo 3T 1.2.1",
                             "DisplayVersion":  "1.2.1"
                         },
                         {
                             "DisplayName":  "TeamViewer 13",
                             "DisplayVersion":  "13.1.3629"
                         },
                         {
                             "DisplayName":  "TreeSize Free V4.1.1",
                             "DisplayVersion":  "4.1.1"
                         },
                         {
                             "DisplayName":  "Windows Deployment Tools",
                             "DisplayVersion":  "10.1.16299.15"
                         },
                         {
                             "DisplayName":  "Citrix Authentication Manager",
                             "DisplayVersion":  "12.0.0.1"
                         },
                         {
                             "DisplayName":  "Microsoft Visual C++ 2013 Redistributable (x64) - 12.0.30501",
                             "DisplayVersion":  "12.0.30501.0"
                         },
                         {
                             "DisplayName":  "Python 3.6.5 Tcl/Tk Support (32-bit)",
                             "DisplayVersion":  "3.6.5150.0"
                         },
                         {
                             "DisplayName":  "Citrix Receiver (HDX Flash Redirection)",
                             "DisplayVersion":  "14.10.1.22"
                         },
                         {
                             "DisplayName":  "VMware Remote Console",
                             "DisplayVersion":  "10.0.2"
                         },
                         {
                             "DisplayName":  "PuTTY release 0.70",
                             "DisplayVersion":  "0.70.0.0"
                         },
                         {
                             "DisplayName":  "Citrix Web Helper",
                             "DisplayVersion":  "4.10.1.7"
                         },
                         {
                             "DisplayName":  "Security Update for CAPICOM (KB931906)",
                             "DisplayVersion":  "2.1.0.2"
                         },
                         {
                             "DisplayName":  "Windows PE ARM ARM64",
                             "DisplayVersion":  "10.1.16299.15"
                         },
                         {
                             "DisplayName":  "Citrix Receiver Inside",
                             "DisplayVersion":  "4.10.1.65534"
                         },
                         {
                             "DisplayName":  "Windows System Image Manager on amd64",
                             "DisplayVersion":  "10.1.16299.15"
                         },
                         {
                             "DisplayName":  "Microsoft Visual C++ 2008 Redistributable - x86 9.0.30729.4148",
                             "DisplayVersion":  "9.0.30729.4148"
                         },
                         {
                             "DisplayName":  "Python 3.6.5 Development Libraries (32-bit)",
                             "DisplayVersion":  "3.6.5150.0"
                         },
                         {
                             "DisplayName":  "Stopping Plex",
                             "DisplayVersion":  "1.9.4285"
                         },
                         {
                             "DisplayName":  "Java 8 Update 151",
                             "DisplayVersion":  "8.0.1510.12"
                         },
                         {
                             "DisplayName":  "Microsoft Visual C++ 2012 Redistributable (x86) - 11.0.61030",
                             "DisplayVersion":  "11.0.61030.0"
                         },
                         {
                             "DisplayName":  "Microsoft Visual C++ 2013 Redistributable (x86) - 12.0.40649",
                             "DisplayVersion":  "12.0.40649.5"
                         },
                         {
                             "DisplayName":  "Java Auto Updater",
                             "DisplayVersion":  "2.8.151.12"
                         },
                         {
                             "DisplayName":  "SQL Server Browser for SQL Server 2012",
                             "DisplayVersion":  "11.0.2100.60"
                         },
                         {
                             "DisplayName":  "VMware vSphere Client 5.5",
                             "DisplayVersion":  "5.5.0.6632"
                         },
                         {
                             "DisplayName":  "Toolkit Documentation",
                             "DisplayVersion":  "10.1.16299.15"
                         },
                         {
                             "DisplayName":  "ConfigMgr 2012 Toolkit R2",
                             "DisplayVersion":  "5.00.7958.1151"
                         },
                         {
                             "DisplayName":  "Python 3.6.5 Core Interpreter (32-bit)",
                             "DisplayVersion":  "3.6.5150.0"
                         },
                         {
                             "DisplayName":  "VMware vSphere Client 6.0",
                             "DisplayVersion":  "6.0.0.7236"
                         },
                         {
                             "DisplayName":  "WebEx Productivity Tools",
                             "DisplayVersion":  "33.0.1.66"
                         },
                         {
                             "DisplayName":  "Python 3.6.5 Utility Scripts (32-bit)",
                             "DisplayVersion":  "3.6.5150.0"
                         },
                         {
                             "DisplayName":  "Python 3.6.5 Documentation (32-bit)",
                             "DisplayVersion":  "3.6.5150.0"
                         },
                         {
                             "DisplayName":  "Citrix Receiver(USB)",
                             "DisplayVersion":  "14.10.1.22"
                         },
                         {
                             "DisplayName":  "Microsoft Visual C++ 2010  x86 Runtime - 10.0.40219",
                             "DisplayVersion":  "10.0.40219"
                         },
                         {
                             "DisplayName":  "Google Update Helper",
                             "DisplayVersion":  "1.3.33.17"
                         },
                         {
                             "DisplayName":  "Plex Media Server",
                             "DisplayVersion":  "1.9.2.4285"
                         },
                         {
                             "DisplayName":  "Microsoft Visual C++ 2015 x86 Additional Runtime - 14.0.24215",
                             "DisplayVersion":  "14.0.24215"
                         },
                         {
                             "DisplayName":  "Cisco ASDM-IDM Launcher",
                             "DisplayVersion":  "1.7.00"
                         },
                         {
                             "DisplayName":  "Windows PE x86 x64 wims",
                             "DisplayVersion":  "10.1.16299.15"
                         },
                         {
                             "DisplayName":  "Windows Assessment and Deployment Kit - Windows 10",
                             "DisplayVersion":  "10.1.16299.15"
                         },
                         {
                             "DisplayName":  "Cisco Jabber",
                             "DisplayVersion":  "11.9.2.57740"
                         },
                         {
                             "DisplayName":  "Adobe AIR",
                             "DisplayVersion":  "29.0.0.112"
                         },
                         {
                             "DisplayName":  "VMware vSphere PowerCLI",
                             "DisplayVersion":  "6.3.0.8258"
                         },
                         {
                             "DisplayName":  "Microsoft SQL Server 2008 R2 Management Objects",
                             "DisplayVersion":  "10.51.2500.0"
                         },
                         {
                             "DisplayName":  "Python 3.6.5 Test Suite (32-bit)",
                             "DisplayVersion":  "3.6.5150.0"
                         },
                         {
                             "DisplayName":  "Kits Configuration Installer",
                             "DisplayVersion":  "10.1.16299.15"
                         },
                         {
                             "DisplayName":  "Citrix Receiver(SSON)",
                             "DisplayVersion":  "14.10.1.22"
                         },
                         {
                             "DisplayName":  "Python Launcher",
                             "DisplayVersion":  "3.6.6295.0"
                         },
                         {
                             "DisplayName":  "Python 3.6.5 Standard Library (32-bit)",
                             "DisplayVersion":  "3.6.5150.0"
                         },
                         {
                             "DisplayName":  "Office 16 Click-to-Run Extensibility Component",
                             "DisplayVersion":  "16.0.9226.2126"
                         },
                         {
                             "DisplayName":  "Office 16 Click-to-Run Localization Component",
                             "DisplayVersion":  "16.0.9226.2126"
                         },
                         {
                             "DisplayName":  "Python 3.6.5 Executables (32-bit)",
                             "DisplayVersion":  "3.6.5150.0"
                         },
                         {
                             "DisplayName":  "Microsoft Application Error Reporting",
                             "DisplayVersion":  "12.0.6012.5000"
                         },
                         {
                             "DisplayName":  "Microsoft Visual C++ 2008 Redistributable - x86 9.0.30729.6161",
                             "DisplayVersion":  "9.0.30729.6161"
                         },
                         {
                             "DisplayName":  "Microsoft Report Viewer 2012 Runtime",
                             "DisplayVersion":  "11.0.2100.60"
                         },
                         {
                             "DisplayName":  "Windows Deployment Customizations",
                             "DisplayVersion":  "10.1.16299.15"
                         },
                         {
                             "DisplayName":  "Microsoft Visual C++ 2013 x86 Additional Runtime - 12.0.40649",
                             "DisplayVersion":  "12.0.40649"
                         },
                         {
                             "DisplayName":  "Adobe Reader XI (11.0.10)",
                             "DisplayVersion":  "11.0.10"
                         },
                         {
                             "DisplayName":  "InstEd 1.5.15.26",
                             "DisplayVersion":  "1.5.15.26"
                         },
                         {
                             "DisplayName":  "VMware OVF Tool",
                             "DisplayVersion":  "4.2.0"
                         },
                         {
                             "DisplayName":  "Self-service Plug-in",
                             "DisplayVersion":  "4.10.1.7"
                         },
                         {
                             "DisplayName":  "Microsoft Visual C++ 2012 x86 Additional Runtime - 11.0.61030",
                             "DisplayVersion":  "11.0.61030"
                         },
                         {
                             "DisplayName":  "Online Plug-in",
                             "DisplayVersion":  "14.10.1.22"
                         },
                         {
                             "DisplayName":  "Microsoft Visual C++ 2015 x86 Minimum Runtime - 14.0.24215",
                             "DisplayVersion":  "14.0.24215"
                         },
                         {
                             "DisplayName":  "Apple Application Support (32-bit)",
                             "DisplayVersion":  "6.2.1"
                         },
                         {
                             "DisplayName":  "Microsoft Visual C++ 2012 x86 Minimum Runtime - 11.0.61030",
                             "DisplayVersion":  "11.0.61030"
                         },
                         {
                             "DisplayName":  "Python 3.6.5 pip Bootstrap (32-bit)",
                             "DisplayVersion":  "3.6.5150.0"
                         },
                         {
                             "DisplayName":  "Apple Software Update",
                             "DisplayVersion":  "2.4.8.1"
                         },
                         {
                             "DisplayName":  "Microsoft SQL Server System CLR Types",
                             "DisplayVersion":  "10.51.2500.0"
                         },
                         {
                             "DisplayName":  "Cisco AnyConnect Secure Mobility Client",
                             "DisplayVersion":  "4.3.02039"
                         },
                         {
                             "DisplayName":  "Microsoft Visual C++ 2012 Redistributable (x64) - 11.0.61030",
                             "DisplayVersion":  "11.0.61030.0"
                         },
                         {
                             "DisplayName":  "RES ONE Automation Console ",
                             "DisplayVersion":  "10.0.100.0"
                         },
                         {
                             "DisplayName":  "Microsoft .NET Framework 4 Multi-Targeting Pack",
                             "DisplayVersion":  "4.0.30319"
                         },
                         {
                             "DisplayName":  "Citrix Receiver(Aero)",
                             "DisplayVersion":  "14.10.1.22"
                         },
                         {
                             "DisplayName":  "Microsoft Visual Studio 2010 Shell (Isolated) - ENU",
                             "DisplayVersion":  "10.0.40219"
                         },
                         {
                             "DisplayName":  "Windows PE x86 x64",
                             "DisplayVersion":  "10.1.16299.15"
                         },
                         {
                             "DisplayName":  "Microsoft ASP.NET MVC 2",
                             "DisplayVersion":  "2.0.60926.0"
                         },
                         {
                             "DisplayName":  "Microsoft Visual C++ 2013 x86 Minimum Runtime - 12.0.40649",
                             "DisplayVersion":  "12.0.40649"
                         },
                         {
                             "DisplayName":  "Microsoft Visual C++ 2015 Redistributable (x86) - 14.0.24215",
                             "DisplayVersion":  "14.0.24215.1"
                         },
                         {
                             "DisplayName":  "Microsoft Visual C++ 2015 Redistributable (x64) - 14.0.23026",
                             "DisplayVersion":  "14.0.23026.0"
                         },
                         {
                             "DisplayName":  "Plex Media Server",
                             "DisplayVersion":  "1.9.4285"
                         },
                         {
                             "DisplayName":  "Citrix Receiver(DV)",
                             "DisplayVersion":  "14.10.1.22"
                         },
                         {
                             "DisplayName":  "Microsoft Visual C++ 2010  x86 Redistributable - 10.0.40219",
                             "DisplayVersion":  "10.0.40219"
                         },
                         {
                             "DisplayName":  "Realtek High Definition Audio Driver",
                             "DisplayVersion":  "6.0.1.7548"
                         },
                         {
                             "DisplayName":  "Microsoft Visual C++ 2013 Redistributable (x86) - 12.0.30501",
                             "DisplayVersion":  "12.0.30501.0"
                         },
                         {
                             "DisplayName":  "Windows PE ARM ARM64 wims",
                             "DisplayVersion":  "10.1.16299.15"
                         }
                     ],
    "Architecture":  "64-bit",
    "OperatingSystem":  "Microsoft Windows 10 Enterprise 2016 LTSB Evaluation"
}


  
}
