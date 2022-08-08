//
//  EventEmiterToJs.h
//  VROOM
//
//  Created by Peeratat Tanachai on 10/5/2565 BE.
//

#import <React/RCTEventEmitter.h>
#import <React/RCTBridgeModule.h>

@interface EventEmiterToJs : RCTEventEmitter <RCTBridgeModule>
- (void)BroadcastStarted;
- (void)BroadcastStopped;
@end
