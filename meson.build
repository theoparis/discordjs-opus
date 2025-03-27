project(
    'node-opus',
    'c',
    'cpp',
    version: '0.0.1',
    meson_version: '>= 1.3.0',
    default_options: [
        'cpp_std=c++26',
        'c_std=c2x',
        'warning_level=3',
        'b_lto=true',
        'b_pch=true',
        'b_staticpic=true',
        'buildtype=debugoptimized',
        'opus:tests=disabled',
    ],
)

opus = dependency('opus', fallback: ['opus', 'opus_dep'])
node_addon_api = dependency(
    'node-addon-api',
    fallback: ['node-addon-api', 'node_addon_api_dep'],
)
node_api_headers = dependency(
    'node-api-headers',
    fallback: ['node-api-headers', 'node_api_headers_dep'],
)

inc = include_directories('src')

cc = meson.get_compiler('c')

link_args = []
link_args += '-Wl,--unresolved-symbols=ignore-all'

library(
    'node-opus',
    ['src/node-opus.cc'],
    include_directories: [inc],
    name_prefix: '',
    name_suffix: 'node',
    dependencies: [opus, node_addon_api, node_api_headers],
    gnu_symbol_visibility: 'inlineshidden',
    link_args: link_args,
    install: true,
)
