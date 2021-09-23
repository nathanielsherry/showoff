class Decoder:
    def decode(self, node): raise Exception('Unimplemented')
    def can_decode(self, node): raise Exception('Unimplemented')

class ImageDecoder(Decoder):
    def decode(self, node):
        #TODO: return in some standardised format
        return node.bytes

    def can_decode(self, mime):
        raise Exception('Unimplemented')
