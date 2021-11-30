jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore myKeyStore.keystore "PATH_TO\app-release-unsigned.apk" ALIAS_NAME
zipalign -v 4  "PATH_TO\app-release-unsigned.apk" "myAppName.apk"
alias= premier_logistics
password = Premier@123

jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore certificates/premier-logistics.keystore "/Users/kathryn/desktop/pls/platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk" premier_logistics
//source ~/.bash_profile
zipalign -v 4  "/Users/kathryn/desktop/pls/platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk" "premier_signed.apk"
apksigner sign --ks certificates/premier-logistics.keystore "premier_signed.apk"
apksigner verify -v "premier_signed.apk"