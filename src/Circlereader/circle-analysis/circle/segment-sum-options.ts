// automatically generated by the FlatBuffers compiler, do not modify

import * as flatbuffers from 'flatbuffers';

export class SegmentSumOptions {
  bb: flatbuffers.ByteBuffer|null = null;
  bb_pos = 0;
  __init(i: number, bb: flatbuffers.ByteBuffer): SegmentSumOptions {
    this.bb_pos = i;
    this.bb = bb;
    return this;
  }

  static getRootAsSegmentSumOptions(bb: flatbuffers.ByteBuffer, obj?: SegmentSumOptions):
      SegmentSumOptions {
    return (obj || new SegmentSumOptions()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }

  static getSizePrefixedRootAsSegmentSumOptions(
      bb: flatbuffers.ByteBuffer, obj?: SegmentSumOptions): SegmentSumOptions {
    bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
    return (obj || new SegmentSumOptions()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }

  static startSegmentSumOptions(builder: flatbuffers.Builder) {
    builder.startObject(0);
  }

  static endSegmentSumOptions(builder: flatbuffers.Builder): flatbuffers.Offset {
    const offset = builder.endObject();
    return offset;
  }

  static createSegmentSumOptions(builder: flatbuffers.Builder): flatbuffers.Offset {
    SegmentSumOptions.startSegmentSumOptions(builder);
    return SegmentSumOptions.endSegmentSumOptions(builder);
  }
}
