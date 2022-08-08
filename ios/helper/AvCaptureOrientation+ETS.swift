import AVKit

extension AVCaptureVideoOrientation {
    init(_ ui: UIInterfaceOrientation) {
        switch ui {
            case .landscapeRight: self = .landscapeRight
            case .landscapeLeft: self = .landscapeLeft
            case .portraitUpsideDown: self = .portraitUpsideDown
            case .portrait: self = .portrait
            case .unknown: self = .portrait
            @unknown default: self = .portrait
        }
    }
    
    static func fromCurrentDeviceOrientation() -> Self? {
        switch UIDevice.current.orientation {
            case .faceDown: return nil
            case .faceUp: return nil
            case .landscapeRight: return .landscapeLeft
            case .landscapeLeft: return .landscapeRight
            case .portrait: return .portrait
            case .portraitUpsideDown: return .portraitUpsideDown
            case .unknown: return nil
            @unknown default: return nil
        }
    }
    
    var isLandscape: Bool { self == .landscapeLeft || self == .landscapeRight }
    
    var name: String {
        switch self {
            case .landscapeRight: return "landscapeLeft"
            case .landscapeLeft: return "landscapeRight"
            case .portrait: return "portrait"
            case .portraitUpsideDown: return "portraitUpsideDown"
            @unknown default: return "unknownDefault"
        }
    }
    
}



extension UIView {
    var isPortrait: Bool { bounds.height > bounds.width }
}

extension CGSize {
    var isPortrait: Bool { height > width }
}

extension UIDeviceOrientation {
    
    var name: String {
        switch self {
            case .faceDown: return "faceDown"
            case .faceUp: return "faceUp"
            case .landscapeRight: return "left"
            case .landscapeLeft: return "right"
            case .portrait: return "portrait"
            case .portraitUpsideDown: return "portraitUpsidedown"
            case .unknown: return "unknown"
            @unknown default: return "default unknown"
        }
    }
}
