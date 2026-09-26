"use client";

import { useEffect } from "react";

type OperatingSystem =
    | "ios"
    | "android"
    | "macos"
    | "windows"
    | "linux"
    | "unknown";

function detectOperatingSystem(): OperatingSystem {
    const userAgent = navigator.userAgent.toLowerCase();
    const platform = navigator.platform?.toLowerCase() ?? "";

    if (
        /ipad|iphone|ipod/.test(userAgent) ||
        (platform === "macintel" && navigator.maxTouchPoints > 1)
    ) {
        return "ios";
    }

    if (/android/.test(userAgent)) {
        return "android";
    }

    if (/mac/.test(platform) || /mac os x/.test(userAgent)) {
        return "macos";
    }

    if (/win/.test(platform) || /windows/.test(userAgent)) {
        return "windows";
    }

    if (/linux/.test(platform) || /linux/.test(userAgent)) {
        return "linux";
    }

    return "unknown";
}

export default function SystemDetector() {
    useEffect(() => {
        const os = detectOperatingSystem();

        document.documentElement.dataset.os = os;
    }, []);

    return null;
}