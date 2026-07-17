const { withAppBuildGradle } = require("@expo/config-plugins");

// Injects a release signingConfig that reads credentials from Gradle properties
// (set in ~/.gradle/gradle.properties). Re-applied on every prebuild so the
// signing survives `expo prebuild --clean`, which regenerates android/.
const RELEASE_SIGNING_CONFIG = `        release {
            if (project.hasProperty('SALARYDAY_UPLOAD_STORE_FILE')) {
                storeFile file(SALARYDAY_UPLOAD_STORE_FILE)
                storePassword SALARYDAY_UPLOAD_STORE_PASSWORD
                keyAlias SALARYDAY_UPLOAD_KEY_ALIAS
                keyPassword SALARYDAY_UPLOAD_KEY_PASSWORD
            }
        }`;

const RELEASE_SIGNING_SELECTOR =
  "signingConfig project.hasProperty('SALARYDAY_UPLOAD_STORE_FILE') ? signingConfigs.release : signingConfigs.debug";

module.exports = function withReleaseSigning(config) {
  return withAppBuildGradle(config, (cfg) => {
    let gradle = cfg.modResults.contents;
    if (gradle.includes("SALARYDAY_UPLOAD_STORE_FILE")) return cfg;

    gradle = gradle.replace(
      /(signingConfigs\s*\{\s*debug\s*\{[\s\S]*?\}\s*)\}/,
      `$1\n${RELEASE_SIGNING_CONFIG}\n    }`,
    );
    gradle = gradle.replace(
      /(buildTypes\s*\{[\s\S]*?release\s*\{[\s\S]*?)signingConfig signingConfigs\.debug/,
      `$1${RELEASE_SIGNING_SELECTOR}`,
    );

    cfg.modResults.contents = gradle;
    return cfg;
  });
};
