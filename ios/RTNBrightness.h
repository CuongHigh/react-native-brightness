
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNRTNBrightnessSpec.h"

@interface RTNBrightness : NSObject <NativeRTNBrightnessSpec>
#else
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RTNBrightness : RCTEventEmitter <RCTBridgeModule>
#endif

@end
