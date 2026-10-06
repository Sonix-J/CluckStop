import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import MapView, {
  Circle,
  Marker,
  type LongPressEvent,
} from "react-native-maps";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Location from "expo-location";
import {
  Bookmark,
  LocateFixed,
  MapPin,
  Navigation,
  ShieldCheck,
} from "lucide-react-native";
import { AppButton, Chip, SearchBox } from "@/components/ui";
import { CEBU_REGION, colors, RADII } from "@/constants";
import { armTrip, requestTripPermissions } from "@/services/backgroundTasks";
import { useRoostopStore } from "@/store/useRoostopStore";
import { distanceMeters, formatDistance } from "@/utils/distance";
import type { Coordinate, Trip } from "@/types";

export default function Home() {
  const map = useRef<MapView>(null);
  const sheet = useRef<BottomSheet>(null);
  const destination = useRoostopStore((s) => s.selectedDestination),
    select = useRoostopStore((s) => s.selectDestination),
    radius = useRoostopStore((s) => s.alertRadius),
    setRadius = useRoostopStore((s) => s.setAlertRadius);
  const activeTrip = useRoostopStore((s) => s.activeTrip),
    status = useRoostopStore((s) => s.tripStatus),
    start = useRoostopStore((s) => s.startTrip),
    end = useRoostopStore((s) => s.endTrip),
    saved = useRoostopStore((s) => s.saved),
    saveDestination = useRoostopStore((s) => s.saveDestination);
  const authStatus = useRoostopStore((s) => s.authStatus);
  const [current, setCurrent] = useState<Coordinate>();
  const [busy, setBusy] = useState(false);
  const [gps, setGps] = useState("Finding your location…");
  const [distance, setDistance] = useState<number>();
  const snapPoints = useMemo(
    () => (destination || activeTrip ? ["27%", "55%"] : ["44%", "62%"]),
    [destination, activeTrip],
  );
  const locate = useCallback(async () => {
    try {
      const existing = await Location.getForegroundPermissionsAsync();
      if (existing.status !== "granted") {
        setGps("Location permission needed");
        return;
      }
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const c = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      };
      setCurrent(c);
      setGps(
        pos.coords.accuracy && pos.coords.accuracy > 100
          ? "Low GPS accuracy"
          : "GPS ready",
      );
      if (destination) setDistance(distanceMeters(c, destination.coordinate));
    } catch {
      setGps("GPS unavailable");
    }
  }, [destination]);
  useEffect(() => {
    const initial = setTimeout(locate, 0);
    const id = setInterval(locate, 20_000);
    return () => {
      clearTimeout(initial);
      clearInterval(id);
    };
  }, [locate]);
  useEffect(() => {
    if (destination) {
      sheet.current?.snapToIndex(1);
      map.current?.animateToRegion({
        ...destination.coordinate,
        latitudeDelta: 0.025,
        longitudeDelta: 0.025,
      });
    }
  }, [destination]);
  const dropPin = (e: LongPressEvent) => {
    const coordinate = e.nativeEvent.coordinate;
    select({
      id: `pin-${Date.now()}`,
      name: "Pinned destination",
      address: `${coordinate.latitude.toFixed(5)}, ${coordinate.longitude.toFixed(5)}`,
      coordinate,
    });
  };
  const begin = async () => {
    if (!destination) return;
    setBusy(true);
    try {
      const permission = await requestTripPermissions();
      if (!permission.ok) {
        router.push({
          pathname: "/permissions",
          params: { missing: permission.reason },
        });
        return;
      }
      const trip: Trip = {
        id: `trip-${Date.now()}`,
        destination,
        startedAt: new Date().toISOString(),
        startCoordinate: current,
        alertRadius: radius,
        alarmTriggered: false,
      };
      await armTrip(trip);
      start(trip);
      sheet.current?.snapToIndex(0);
    } catch {
      Alert.alert(
        "Couldn’t start trip",
        "Check that location services are on and try again. Background tracking requires a development build, not Expo Go.",
      );
    } finally {
      setBusy(false);
    }
  };
  if (activeTrip && status !== "idle")
    return (
      <ActiveTripMap
        map={map}
        current={current}
        distance={
          destination && current
            ? distanceMeters(current, destination.coordinate)
            : distance
        }
        gps={gps}
        onStop={() =>
          Alert.alert(
            "Stop this trip?",
            "Cluckie will no longer watch for your destination.",
            [
              { text: "Keep trip", style: "cancel" },
              {
                text: "Stop trip",
                style: "destructive",
                onPress: async () => {
                  const { disarmTrip } = await import(
                    "@/services/backgroundTasks"
                  );
                  await disarmTrip();
                  end();
                },
              },
            ],
          )
        }
      />
    );
  return (
    <View className="flex-1 bg-cream">
      <MapView
        ref={map}
        style={{ flex: 1 }}
        initialRegion={CEBU_REGION}
        showsUserLocation
        showsMyLocationButton={false}
        onLongPress={dropPin}
        accessibilityLabel="Destination map"
      >
        {destination && (
          <>
            <Marker
              coordinate={destination.coordinate}
              pinColor={colors.rooster}
              title={destination.name}
            />
            <Circle
              center={destination.coordinate}
              radius={radius}
              strokeColor="rgba(180,35,47,.75)"
              fillColor="rgba(180,35,47,.12)"
            />
          </>
        )}
      </MapView>
      <SafeAreaView
        pointerEvents="box-none"
        className="absolute inset-x-0 top-0 px-4 pt-2"
      >
        <View className="mt-2 flex-row items-center">
          <Pressable className="flex-1 rounded-app bg-panel shadow-lg" onPress={() => router.push("/search")}>
            <SearchBox
              editable={false}
              placeholder="Where should we wake you?"
            />
          </Pressable>
        </View>
      </SafeAreaView>
      <Pressable
        onPress={locate}
        accessibilityLabel="Center on my location"
        className="absolute right-4 top-32 h-12 w-12 items-center justify-center rounded-full bg-panel shadow"
      >
        <LocateFixed size={22} color={colors.ink} />
      </Pressable>
      <BottomSheet
        ref={sheet}
        index={0}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        backgroundStyle={{ backgroundColor: colors.panel }}
        handleIndicatorStyle={{ backgroundColor: colors.line, width: 42 }}
      >
        <BottomSheetView className="px-5 pb-7">
          {destination ? (
            <>
              <View className="flex-row items-start">
                <View className="mt-1 h-10 w-10 items-center justify-center rounded-full bg-red-100">
                  <MapPin size={21} color={colors.rooster} />
                </View>
                <View className="ml-3 flex-1">
                  <Text className="text-xl font-bold text-ink">
                    {destination.name}
                  </Text>
                  <Text className="mt-1 text-sm text-muted">
                    {destination.address}
                  </Text>
                  <Text className="mt-2 font-semibold text-ink">
                    {formatDistance(distance)} away
                  </Text>
                </View>
                <Pressable
                  accessibilityLabel="Save destination"
                  accessibilityState={{ selected: saved.some((item) => item.id === destination.id) }}
                  onPress={() => authStatus === 'authenticated'
                    ? saveDestination({ ...destination, label: destination.name, defaultRadius: radius })
                    : router.push('/(tabs)/saved')}
                  className="p-2"
                >
                  <Bookmark
                    size={23}
                    color={saved.some((item) => item.id === destination.id) ? colors.rooster : colors.muted}
                    fill={saved.some((item) => item.id === destination.id) ? colors.rooster : 'none'}
                  />
                </Pressable>
              </View>
              <Text className="mb-3 mt-6 text-sm font-bold uppercase tracking-wider text-muted">
                Alert me before I arrive
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {RADII.map((r) => (
                  <Chip
                    key={r}
                    selected={radius === r}
                    label={r < 1000 ? `${r} m` : `${r / 1000} km`}
                    onPress={() => setRadius(r)}
                  />
                ))}
              </View>
              <AppButton
                className="mt-6"
                title="Start trip"
                loading={busy}
                icon={<Navigation size={20} color="white" />}
                onPress={begin}
              />
              <Text className="mt-3 text-center text-xs leading-5 text-muted">
                GPS and operating-system settings can affect alerts. Keep your
                phone charged.
              </Text>
            </>
          ) : (
            <>
              <Text className="text-xl font-bold text-ink">
                Where should we wake you?
              </Text>
              <Text className="mt-1 text-sm text-muted">
                Search above or press and hold the map to drop a pin.
              </Text>
              {authStatus === 'authenticated' && saved.length > 0 && (
                <View className="mt-4 flex-row gap-2">
                  {saved.slice(0, 2).map((s) => (
                    <Chip
                      key={s.id}
                      label={s.label}
                      onPress={() => select(s)}
                    />
                  ))}
                </View>
              )}
            </>
          )}
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}

function ActiveTripMap({
  map,
  current,
  distance,
  gps,
  onStop,
}: {
  map: React.RefObject<MapView | null>;
  current?: Coordinate;
  distance?: number;
  gps: string;
  onStop(): void;
}) {
  const trip = useRoostopStore((s) => s.activeTrip)!;
  const trigger = useRoostopStore((s) => s.triggerAlarm);
  useEffect(() => {
    if (
      distance != null &&
      distance <= trip.alertRadius &&
      !trip.alarmTriggered
    ) {
      trigger(distance);
      router.replace("/alarm");
    }
  }, [distance, trigger, trip.alarmTriggered, trip.alertRadius]);
  return (
    <View className="flex-1 bg-cream">
      <MapView
        ref={map}
        style={{ flex: 1 }}
        initialRegion={{
          ...trip.destination.coordinate,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04,
        }}
        showsUserLocation
      >
        <Marker
          coordinate={trip.destination.coordinate}
          pinColor={colors.rooster}
        />
        <Circle
          center={trip.destination.coordinate}
          radius={trip.alertRadius}
          strokeColor={colors.rooster}
          fillColor="rgba(180,35,47,.14)"
        />
      </MapView>
      <SafeAreaView className="absolute inset-x-0 top-0 px-4">
        <View className="mt-2 flex-row items-center rounded-app border border-line bg-panel p-3">
          <View className="h-3 w-3 rounded-full bg-green-600" />
          <Text className="ml-2 flex-1 text-sm font-bold text-ink">
            ACTIVE TRIP
          </Text>
          <Text className="text-xs font-semibold text-muted">{gps}</Text>
        </View>
      </SafeAreaView>
      <View className="absolute inset-x-4 bottom-5 rounded-[24px] border border-line bg-panel p-5 shadow-lg">
        <Text className="text-sm font-bold uppercase tracking-wider text-rooster">
          Next alarm
        </Text>
        <Text className="mt-2 text-2xl font-bold text-ink">
          {trip.destination.name}
        </Text>
        <Text className="mt-2 text-[38px] font-bold text-ink">
          {formatDistance(distance)}
        </Text>
        <View className="my-4 h-px bg-line" />
        <View className="flex-row items-center">
          <ShieldCheck size={20} color={colors.rooster} />
          <Text className="ml-2 flex-1 text-sm leading-5 text-muted">
            We’ll alert you about {formatDistance(trip.alertRadius)} before your
            destination.
          </Text>
        </View>
        <AppButton
          className="mt-5"
          variant="secondary"
          title="Stop trip"
          onPress={onStop}
        />
      </View>
    </View>
  );
}
