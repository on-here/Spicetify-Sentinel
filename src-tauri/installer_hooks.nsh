!macro customUnInstall
  ; Remove startup entry from Windows Registry
  DeleteRegValue HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "SpicetifySentinel"

  ; Clean up application data and configuration flags
  RMDir /r "$APPDATA\SpicetifySentinel"
!macroend
