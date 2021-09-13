from showoff import server
from showoff.sources.filesystem import FilesystemSource
from showoff.server import app as application

server.source = FilesystemSource('/gallery')
server.static = '/var/www/html/'
