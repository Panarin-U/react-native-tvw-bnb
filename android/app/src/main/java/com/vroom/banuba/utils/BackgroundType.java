package com.vroom.banuba.utils;

public enum BackgroundType {
    None("None"), Office1("Office_1"),Office2("Office_2"),Office3("Office_3"),Office4("Office_4"),
    Natural1("Natural_1"),Natural2("Natural_2"),Natural3("Natural_3"),Blur1("Blur_1"),
    Blur2("Blur_2"),Room1("Room_1"),True1("True5G_1"),True2("True5G_2"),
    True3("True5G_3"),Custom("Custom");

    private final String value;

     BackgroundType(String value){
        this.value = value;
    }

    public String getValue() {
        return value;
    }
    public static BackgroundType fromString(String text) {
        for (BackgroundType b : BackgroundType.values()) {
            if (b.value.equalsIgnoreCase(text)) {
                return b;
            }
        }
        return BackgroundType.None;
    }
}
