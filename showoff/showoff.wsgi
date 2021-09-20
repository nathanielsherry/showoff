from showoff import server
from showoff.sources.filesystem import FilesystemSource
from showoff.render import ImageRenderer
from showoff.server import create_application

server.source = FilesystemSource('/gallery')
server.static = '/var/www/html/'
server.renderer = ImageRenderer()

application = create_application()
