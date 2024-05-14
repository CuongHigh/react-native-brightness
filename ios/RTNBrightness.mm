#import "RTNBrightness.h"

@implementation RTNBrightness
{
    bool hasListeners;
}
RCT_EXPORT_MODULE(RTNBrightness)


RCT_EXPORT_METHOD(resetBrightness){}

RCT_EXPORT_METHOD(getSysBrightness:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject){
    resolve(@(UIScreen.mainScreen.brightness));
}

RCT_EXPORT_METHOD(getAppBrightness:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject){
    resolve(@(UIScreen.mainScreen.brightness));
}

RCT_EXPORT_METHOD(setAppBrightness:(float)brightness){
    NSLog(@"%f", brightness);
    [self changeBrightness:brightness];
}

- (void)sendEventBrightness:(NSNotification *)notification
{
    if (hasListeners) {// Only send events if anyone is listening
        [self sendEventWithName:@"Sys_Brightness_Change" body:@{@"brightness": @(UIScreen.mainScreen.brightness)}];
    }
}

- (NSArray<NSString *> *)supportedEvents {
    return @[@"Sys_Brightness_Change"];
}

// Will be called when this module's first listener is added.
-(void)startObserving {
    hasListeners = YES;
    // Set up any upstream listeners or background tasks as necessary
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(sendEventBrightness:)
                                                 name:UIScreenBrightnessDidChangeNotification
                                               object:nil];
}

// Will be called when this module's last listener is removed, or on dealloc.
-(void)stopObserving {
    hasListeners = NO;
    // Remove upstream listeners, stop unnecessary background tasks
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

-(void)changeBrightness:(float)brightness {
    dispatch_async(dispatch_get_main_queue(), ^{
        // Code that needs to be run on the main thread.
        UIScreen.mainScreen.brightness = brightness;
    });
}

@end
