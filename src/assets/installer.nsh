!include LogicLib.nsh
!define THIRD_PARTY_INSTALLER "setup.exe"
!define SOS_INSTALL_DIRECTORY_NAME "ProMAX SOS app"
!define NET_VERSION "6.0"

!macro customInit
  SetRegView 64
  ReadRegStr $0 HKLM SOFTWARE\dotnet\Setup\InstalledVersions\x64\sharedhost Version
  ${if} $0 < 6
      MessageBox MB_OK "Microsoft .NET 6.0 Runtime is required before you can install this product."
      Abort
  ${EndIf}
!macroend

!macro preInit
  SetRegView 64
  WriteRegExpandStr HKLM "${INSTALL_REGISTRY_KEY}" InstallLocation "C:\Program Files\ProMAX\${SOS_INSTALL_DIRECTORY_NAME}"
  WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation "C:\Program Files\ProMAX\${SOS_INSTALL_DIRECTORY_NAME}"
!macroend

!macro customInstall
  ExecWait '"$INSTDIR\resources\${THIRD_PARTY_INSTALLER}"'
!macroend
