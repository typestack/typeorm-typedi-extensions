# Changelog

## [0.4.1][v0.4.1] - 2021-02-22

### Added

- added custom `Container` to register with TypeORM, this custom container makes sure services exists before
  requesting them, preventing `ServiceNotFoundException`

## [0.4.0][v0.4.0] - 2021-01-15

### Fixed

- made the package compatible with TypeDI 0.9.0+

### Added

- added support for using scoped TypeDI containers instead of global one
- basic test case has been added and configured to run for every commit
- introduced Prettier to the project

### Changed

- updated project tooling to TS only build
- updated various dev dependencies

## < 0.2.3 - 2019.01.14

_No changelog before release 0.2.3._

[v0.4.0]: https://github.com/typeorm/typeorm-typedi-extensions/compare/v0.2.3...v0.4.0
[v0.4.1]: https://github.com/typeorm/typeorm-typedi-extensions/compare/v0.4.0...v0.4.1
