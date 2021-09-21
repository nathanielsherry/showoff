from showoff import server
from showoff.sources.filesystem import FilesystemSource
from showoff.render import ImageRenderer
from showoff.server import create_application
from showoff.preload.thread import DaemonThreadPreloader
    

server.source = FilesystemSource('/gallery')
server.static = '/var/www/html/'
server.renderer = ImageRenderer()
server.preloader = preloader = DaemonThreadPreloader(server.renderer)

application = create_application()
