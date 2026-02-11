---
title: Grand Star (rust-wii)
description: "A set of Rust toolchains and libraries for the Nintendo Wii"
date: 2019-06-02
github: https://github.com/rust-wii/ogc-rs
tags:
  - Rust
  - Nintendo Wii
---
## A set of Rust toolchains and libraries for the Nintendo Wii.
Grand Star is composed of two independant libraries, both of which can be used to write Wii homebrew in Rust.

## ogc-rs
A safe, idiomatic Rust wrapper library for devkitPro's `libogc`.
`ogc-rs` provides a Rust target, examples, and documented bindings for rapid development of Wii homebrew in Rust, for those who are already familiar with developing Wii homebrew.

## luma
A pure Rust library for Wii and Gamecube homebrew, with an API similar to `libogc`.
Very experimental, with an API subject to change. 