//
//  ScheenshareEventEmiter.m
//  VROOM
//
//  Created by Peeratat Tanachai on 10/5/2565 BE.
//

#import "ScheenshareEventEmiter.h"
#import <React/RCTLog.h>
#import "EventEmiterToJs.h"

NSNotificationName const kBroadcastStartedNotification = @"iOS_BroadcastStarted";
NSNotificationName const kBroadcastStoppedNotification = @"iOS_BroadcastStopped";

@implementation ScheenshareEventEmiter {
  CFNotificationCenterRef _notificationCenter;
}

- (instancetype)init {
    self = [super init];
    if (self) {
      _notificationCenter = CFNotificationCenterGetDarwinNotifyCenter();
      [self setupObserver];
    }
    
    return self;
}

- (void)dealloc {
  [self clearObserver];
}

// MARK: Private Methods

- (void)setupObserver {
  RCTLog(@"ScheenshareEventEmiter setupObserver");
  CFNotificationCenterAddObserver(_notificationCenter, (__bridge const void *)(self), broadcastStartedNotificationCallback, (__bridge CFStringRef)kBroadcastStartedNotification, NULL, CFNotificationSuspensionBehaviorDeliverImmediately);
  CFNotificationCenterAddObserver(_notificationCenter, (__bridge const void *)(self), broadcastStoppedNotificationCallback, (__bridge CFStringRef)kBroadcastStoppedNotification, NULL, CFNotificationSuspensionBehaviorDeliverImmediately);
}

- (void)clearObserver {
  RCTLog(@"ScheenshareEventEmiter clearObserver");
  CFNotificationCenterRemoveObserver(_notificationCenter, (__bridge const void *)(self), (__bridge CFStringRef)kBroadcastStartedNotification, NULL);
  CFNotificationCenterRemoveObserver(_notificationCenter, (__bridge const void *)(self), (__bridge CFStringRef)kBroadcastStoppedNotification, NULL);
}

void broadcastStartedNotificationCallback(CFNotificationCenterRef center, void *observer, CFStringRef name, const void *object, CFDictionaryRef userInfo) {
  RCTLog(@"ScheenshareEventEmiter Broadcast Started");
  EventEmiterToJs *eventEmiterToJs = [EventEmiterToJs allocWithZone:nil];
  [eventEmiterToJs BroadcastStarted];
}

void broadcastStoppedNotificationCallback(CFNotificationCenterRef center, void *observer, CFStringRef name, const void *object, CFDictionaryRef userInfo) {
  RCTLog(@"ScheenshareEventEmiter Broadcast Stopped");
  EventEmiterToJs *eventEmiterToJs = [EventEmiterToJs allocWithZone:nil];
  [eventEmiterToJs BroadcastStopped];
}

@end
