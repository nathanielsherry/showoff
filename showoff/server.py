#!/usr/bin/python

import sys, json, io, traceback
from flask import Flask, url_for, send_file, jsonify, redirect, request
from showoff import log
from showoff.sources import Collection, Document

source = None
renderer = None
static = None
preloader = None

def create_application():
    global source
    global renderer
    global static
    global preloader
    
    app = Flask("ShowOff", static_url_path=static)
    app.url_map.strict_slashes = False

    #@app.before_request
    def clean_path():
        path = request.path
        path = path.replace('//', '/')
        if path != '/' and path.endswith('/'):
            path = path[:-1]
        return None if path == request.path else redirect(path);

    def split_path(path):
        path = path.split('/')
        return [p for p in path if p]

    @app.route('/<path:path>')
    def main(path):
        return str(path)    

    @app.route('/list/', defaults={'path': ''})
    @app.route('/list/<path:path>')
    def list(path):
        try:
            node = source.at(split_path(path))  
            return jsonify(node.dump(deep=True))
        except:
            log(traceback.format_exc())

    @app.route('/image/<path:path>')
    def image(path):
        print('Image {}'.format(path))
        node = source.document_at(split_path(path))
        return send_file(
            io.BytesIO(renderer.fullimage(node)),
            mimetype=node.datatype)


    @app.route('/thumb/<path:path>')
    def thumb(path):
        print('Thumb {}'.format(path))
        node = source.at(split_path(path))
        if node.datatype == 'collection':
            return send_file(
                static + 'folder.png',
                mimetype='image')
        else:
            return send_file(
                io.BytesIO(renderer.thumbnail(node)),
                mimetype=node.datatype)
    
    @app.route('/placeholder/<path:path>')
    def placeholder(path):
        print('Placeholder {}'.format(path))
        node = source.at(split_path(path))
        if node.datatype == 'collection':
            #TODO: should this be an error?
            return send_file(
                static + 'folder.png',
                mimetype='image')
        else:
            return send_file(
                io.BytesIO(renderer.placeholder(node)),
                mimetype=node.datatype)

    if preloader:
        preloader.start()
        preloader.load_subtree(source.root)

    return app

if __name__ == "__main__":
    from showoff.sources.filesystem import FilesystemSource
    from showoff.render import BasicRenderer
    
    source = FilesystemSource('../gallery')
    static = '/static'
    renderer = BasicRenderer()
    #from showoff.preload.thread import DaemonThreadPreloader
    #preloader = DaemonThreadPreloader(renderer)
    from showoff.preload.multiprocessing import MultiprocessingPreloader
    preloader = MultiprocessingPreloader(renderer)
    create_application().run(debug=True, host='0.0.0.0', port=5000)
