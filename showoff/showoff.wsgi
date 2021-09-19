from showoff import server
from showoff.sources.filesystem import FilesystemSource
from showoff.server import create_application

server.source = FilesystemSource('/gallery')
server.static = '/var/www/html/'

application = create_application()
