from showoff.sources.thumbnailer import Thumbnailer
import io, json

class Source:
    def __init__(self):
        self._thumbnailer = Thumbnailer(self)
    
    #Returns a list of Documents
    def list_documents(self, path):
        raise Exception('Unimplemented')
    
    #Returns a list of Collections
    def list_links(self, path):
        raise Exception('Unimplemented')      
    
    def get_document_bytes(self, path):
        raise Exception('Unimplemented')
    
    def at(self, path):
        raise Exception('Unimplemented')
    
    @property
    def thumbnailer(self): return self._thumbnailer
    
    @property
    def root(self): return self.make_link([])
     
    def collection_at(self, path):
        collection = self.at(path)
        if not isinstance(collection, Collection):
            raise Exception('Node is not a Collection, but a {}'.format(type(collection)))
        return collection
    
    def document_at(self, path):
        document = self.at(path)
        if not isinstance(document, Document):
            raise Exception('Node is not a Document')
        return document
    
    #TODO
    def make_document(self, path): return Image(self, path)
    def make_link(self, path): return Collection(self, path)

class Node:
    def __init__(self, source, path):
        self._source = source
        self._path = path

    @property
    def source(self): return self._source
    
    @property
    def path(self): return self._path
    
    @property
    def parent(self):
        if self.path: 
            return self.source.at(self.path[:-1])
        return self.source.at([])
    
    @property
    def parents(self):
        if self.path:
            parent = self.parent
            parents = parent.parents + [parent]
            return parents  
        return []
    
    @property
    def datatype(self): raise Exception('Unimplemented');
    
    @property
    def title(self):
        title = self.path[-1] if self.path else ''
        #TODO: show filetype as a subtitle? mimetype something something...
        #if '.' in title:
        #    title = '.'.join(title.split('.')[:-1])
        return title
    
    def dump(self, deep=False):
        data = {
            'title': self.title,
            'type': self.datatype,
            'path': self.path,
            'deep': deep,
        }
        if deep:
            data['parents'] = [p.dump(deep=False) for p in self.parents]
        return data

   
class Document(Node):

    @property
    def bytes(self): return self.source.get_document_bytes(self.path)
    
    @property
    def image(self): raise Exception('Unimplemented')
    
    @property
    def thumb(self):
        return self.source.thumbnailer.thumbnail(self)
        


class Image(Document):

    @property
    def datatype(self): return 'image'
    
    @property
    def image(self): return self.bytes
    

class Collection(Node):
        
    @property
    def documents(self):
        return self.source.list_documents(self.path)

    @property
    def links(self):
        return self.source.list_links(self.path)
    
    @property
    def parent(self):
        return self.source.make_link(self.path[:-1])
        
    @property
    def root(self):
        return self.source.make_link([])
        
    @property
    def datatype(self): return 'collection';
    
    def dump(self, deep=True):
        value = super().dump(deep=deep)
        if deep:
            entries = []
            entries += [n.dump(deep=False) for n in self.links]
            entries += [n.dump(deep=False) for n in self.documents]
            value['entries'] = entries
        return value
