!define thirdPartyExe "{{SYNC_SERVICE_INSTALLER}}"

!macro preInit
 SetRegView 64
  WriteRegExpandStr HKLM "${INSTALL_REGISTRY_KEY}" InstallLocation "C:\Program Files\ProMAX"
  WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation "C:\Program Files\ProMAX"
 SetRegView 32
  WriteRegExpandStr HKLM "${INSTALL_REGISTRY_KEY}" InstallLocation "C:\Program Files\ProMAX"
  WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation "C:\Program Files\ProMAX"
!macroend
!macro customInstall
  ExecWait '"$INSTDIR\resources\${thirdPartyExe}"'
!macroend