// soemdsp-native-module: shooting_star_explosion
// soemdsp-native-label: Shooting Star Explosion
// soemdsp-native-target: shootingStarExplosion
// soemdsp-native-kind: game trigger

namespace {

static const char kMetadataJson[] =
  "{"
    "\"module\":\"shooting_star_explosion\","
    "\"label\":\"Shooting Star Explosion\","
    "\"targetType\":\"shootingStarExplosion\","
    "\"kind\":\"game trigger\","
    "\"inputs\":[],"
    "\"outputs\":[\"Pulse\"],"
    "\"parameters\":["
      "{"
        "\"key\":\"lowRange\","
        "\"label\":\"Low Range\","
        "\"defaultValue\":6,"
        "\"min\":0,"
        "\"mid\":10,"
        "\"max\":20,"
        "\"step\":\"any\","
        "\"tooltip\":\"Raw shooting-star speed that maps to zero explosion power.\""
      "},"
      "{"
        "\"key\":\"highRange\","
        "\"label\":\"High Range\","
        "\"defaultValue\":10,"
        "\"min\":0,"
        "\"mid\":10,"
        "\"max\":20,"
        "\"step\":\"any\","
        "\"tooltip\":\"Raw shooting-star speed that maps to full explosion power.\""
      "}"
    "]"
  "}";

}  // namespace

extern "C" double soemdsp_shooting_star_explosion_power(
  double speed,
  double lowRange,
  double highRange
) {
  // Negative speed is the "no speed data" sentinel (site didn't send one) --
  // keep the pulse at full power rather than guessing a range mapping.
  if (speed < 0.0) {
    return 1.0;
  }
  const double span = highRange - lowRange;
  if (span <= 0.0) {
    return 0.0;
  }
  double power = (speed - lowRange) / span;
  if (power < 0.0) power = 0.0;
  if (power > 1.0) power = 1.0;
  return power;
}

extern "C" int soemdsp_shooting_star_explosion_version() {
  return 1;
}

extern "C" const char* soemdsp_shooting_star_explosion_metadata_json() {
  return kMetadataJson;
}

extern "C" int soemdsp_shooting_star_explosion_metadata_json_size() {
  return sizeof(kMetadataJson) - 1;
}
