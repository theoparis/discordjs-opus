cmake_minimum_required(VERSION 3.20)

set(CMAKE_DISABLE_IN_SOURCE_BUILDS ON)
set(CMAKE_DISABLE_SOURCE_CHANGES ON)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)
set(CMAKE_POSITION_INDEPENDENT_CODE ON)

project(node-opus LANGUAGES CXX)


if (CMAKE_SYSTEM_NAME STREQUAL "Windows")
  set(LINK_OPTIONS "-Wl,/FORCE:UNRESOLVED")
elseif(CMAKE_CXX_COMPILER_ID STREQUAL "GNU")
  set(LINK_OPTIONS "-Wl,--unresolved-symbols=ignore-all")
else()
  set(LINK_OPTIONS "-Wl,-undefined,dynamic_lookup")
endif()

set(OPUS_PACKAGE_VERSION 1.5.2)
include(FetchContent)
FetchContent_Declare(
  opus
  GIT_REPOSITORY https://github.com/xiph/opus
  GIT_TAG 1c370855aa0e7fe3f583d74a2ffd48ca1432a479
  GIT_SHALLOW ON
  GIT_PROGRESS ON
)
FetchContent_MakeAvailable(
  opus
)

FetchContent_Declare(
  node_addon_api
  GIT_REPOSITORY https://github.com/nodejs/node-addon-api.git
  GIT_TAG 723f094374bc3ae9bd94d9bcc4b44604c70a5425
)

FetchContent_MakeAvailable(
  node_addon_api
)

FetchContent_Declare(
  node_api_headers
  GIT_REPOSITORY https://github.com/nodejs/node-api-headers.git
  GIT_TAG d46edabd5bbacc08393578eb19fc2eba7021b597
)

FetchContent_MakeAvailable(
  node_api_headers
)

add_library(
  node-opus
  SHARED
  ${CMAKE_CURRENT_SOURCE_DIR}/src/node-opus.cc
)
target_include_directories(
  node-opus
  PUBLIC
  ${node_addon_api_SOURCE_DIR}
  ${node_api_headers_SOURCE_DIR}/include
)
target_link_libraries(
  node-opus
  PUBLIC
  opus
)
target_link_options(
  node-opus
  PUBLIC
  ${LINK_OPTIONS}
)
target_compile_features(
  node-opus
  PUBLIC
  cxx_std_17
)

set(TARGET_NAME ${CMAKE_SYSTEM_NAME}-${CMAKE_SYSTEM_PROCESSOR})
string(TOLOWER ${TARGET_NAME} TARGET_NAME)

set_target_properties(
  node-opus PROPERTIES
  OUTPUT_NAME "node-opus-${TARGET_NAME}.node"
  PREFIX
  ""
  SUFFIX ""
)
set_target_properties(
  node-opus PROPERTIES
  LIBRARY_OUTPUT_DIRECTORY
  ${CMAKE_CURRENT_SOURCE_DIR}/build/lib
)
