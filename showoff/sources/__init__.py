from showoff.sources.render import ImageRenderer
import io, json

class Source:
    def __init__(self):
        self._renderer = ImageRenderer(self)
    
    #Returns a list of Documents
    def list_documents(self, path):
        raise Exception('Unimplemented')
    
    #Returns a list of Collections
    def list_links(self, path):
        raise Exception('Unimplemented')      
    
    def get_document_bytes(self, path):
        raise Exception('Unimplemented')
    
    def get_document_size(self, path):
        raise Exception('Unimplemented')

    def get_document_times(self, path):
        raise Exception('Unimplemented')
    
    def get_document_mimetype(self, path):
        raise Exception('Unimplemented')
    
    def at(self, path):
        raise Exception('Unimplemented')
    
    @property
    def renderer(self): return self._renderer
    
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

class Cursor:
    @property
    def previous(self): raise Exception("Unimplemented")
    
    @property
    def next(self): raise Exception("Unimplemented")
    
    @property
    def index(self): raise Exception("Unimplemented")
    
    @property
    def size(self): raise Exception("Unimplemented")
    
    @property
    def has_next(self): return self.next != None
    
    @property
    def has_previous(self): return self.previous != None
    
    def dump(self):
        return {
            'previous': self.previous.dump(deep=False) if self.previous else None,
            'next': self.next.dump(deep=False) if self.next else None,
            'index': self.index,
            'size': self.size,
        }
        
class EasyCursor(Cursor):
    def __init__(self, previous, next, size, index):
        self._previous = previous
        self._next = next
        self._size = size
        self._index = index
        
    @property
    def previous(self): return self._previous
    
    @property
    def next(self): return self._next
    
    @property
    def index(self): return self._index
    
    @property
    def size(self): return self._size

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
        return None
    
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
    def datatype(self): return 'document'

    @property
    def bytes(self): return self.source.get_document_bytes(self.path)
    
    @property
    def image(self): raise Exception('Unimplemented')
    
    @property
    def thumb(self):
        return self.source.renderer.render(self, 128)
    
    def render(self, ideal_width, ideal_height):
        return self.source.renderer.render(self, (ideal_width, ideal_height))
    
    @property
    def mimetype(self): return self.source.get_document_mimetype(self.path)
    
    @property
    def size(self): return self.source.get_document_size(self.path)
    
    @property
    def times(self): return self.source.get_document_times(self.path)
    
    @property
    def cursor(self):
        parent = self.parent
        siblings = parent.documents
        size = len(siblings)
        index = None
        for i in range(0, size):
            if siblings[i].path == self.path:
                index = i
                break
        if index == None:
            raise Exception('Cannot find self in parent')
        
        pi = index-1
        ni = index+1
        previous = None
        next = None
        if pi >= 0: previous = siblings[pi]
        if ni < size: next = siblings[ni]
        
        return EasyCursor(previous, next, size, index)
        
    
    def dump(self, deep=True):
        value = super().dump(deep=deep)
        value['mimetype'] = self.mimetype
        value['size'] = self.size
        value['times'] = self.times
        if deep:
            value['cursor'] = self.cursor.dump()
        return value


class Image(Document):

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
    def entries(self):
        return self.links + self.documents;
    
    @property
    def size(self): return len(self.entries)
    
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
            value['entries'] = [n.dump(deep=False) for n in self.entries]
        return value
