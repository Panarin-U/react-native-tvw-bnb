//
//  EventEmiterToJs.m
//  VROOM
//
//  Created by Peeratat Tanachai on 10/5/2565 BE.
//

#import "EventEmiterToJs.h"

@implementation EventEmiterToJs

RCT_EXPORT_MODULE();

+ (id)allocWithZone:(NSZone *)zone {
    static EventEmiterToJs *sharedInstance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [super allocWithZone:zone];
    });
    return sharedInstance;
}

- (NSArray<NSString *> *)supportedEvents {
    return @[@"BroadcastStarted", @"BroadcastStopped"];
}

- (void)BroadcastStarted {
  [self sendEventWithName:@"BroadcastStarted" body:nil];
}

- (void)BroadcastStopped {
  [self sendEventWithName:@"BroadcastStopped" body:nil];
}

@end
