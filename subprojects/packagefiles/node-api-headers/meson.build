project(
    'node-api-headers',
    'c',
    version: '9.0.0',
    meson_version: '>= 1.3.0',
    default_options: [
        'cpp_std=c++17',
        'warning_level=3',
        'b_lto=true',
        'b_pch=true',
        'buildtype=debugoptimized',
    ],
)

node_api_headers_dep = declare_dependency(
    include_directories: include_directories('include'),
)
