require 'json'

Pod::Spec.new do |s|
  package = JSON.parse(File.read(File.join(File.dirname(__FILE__), 'package.json')))

  s.name = 'CapacitorSdkAmplitude'
  s.version = package['version']
  s.summary = package['description']
  s.license = package['license']
  s.homepage = 'https://github.com/dsteinel/capacitor-amplitude-sdk'
  s.author = package['author']
  s.ios.deployment_target = '16.0'
  s.dependency 'Capacitor'
  s.dependency 'AmplitudeSwift', '~> 1.0'
  s.static_framework = true
  s.source = { :git => 'https://github.com/dsteinel/capacitor-amplitude-sdk.git', :tag => s.version.to_s }
  s.source_files = 'ios/Sources/CapacitorAmplitude/**/*.{swift,h,m}'
  s.swift_version = '5.9'
end
