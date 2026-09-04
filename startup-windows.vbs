' ==============================================================================
' SRK Innovations ERP - Silent Background Auto-Start Script for Windows
' Place this shortcut or file into your Windows Startup Folder:
' Press Win+R, type "shell:startup" and press Enter, then paste this file!
' ==============================================================================

Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

' Get Current Directory Path
strPath = fso.GetAbsolutePathName(".")

' Execute start-server.bat silently in background (0 = Hidden Window)
WshShell.Run strPath & "\start-server.bat", 0, False
