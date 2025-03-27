export declare const OpusEncoder: {
	new (rate: number, channels: number): typeof OpusEncoder;
	encode(buffer: Buffer): Buffer;
	/**
	 * Decodes the given Opus buffer to PCM signed 16-bit little-endian
	 * @param buffer Opus buffer
	 */
	decode(buffer: Buffer): Buffer;
	applyEncoderCTL(ctl: number, value: number): void;
	applyDecoderCTL(ctl: number, value: number): void;
	setBitrate(bitrate: number): void;
	getBitrate(): number;
};
