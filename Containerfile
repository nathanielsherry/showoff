FROM docker.io/rockylinux/rockylinux:latest

# Install reqs
RUN dnf -y install httpd python3-pillow python3-flask python3-mod_wsgi python3-pip
RUN pip3 install python-magic

# Install ShowOff package 
COPY ./showoff/ /opt/showoff
RUN ln -s /opt/showoff/ /usr/lib/python3.6/site-packages/showoff

# Configure web server
COPY ./showoff/showoff.conf /etc/httpd/conf.d/showoff.conf
COPY ./showoff/showoff.wsgi /var/www/showoff/showoff.wsgi
# Conflicts with `icons` directory
RUN rm /etc/httpd/conf.d/autoindex.conf
RUN rm -rf /var/www/html
RUN ln -s /opt/showoff/static /var/www/html

# Run web server
VOLUME /gallery
EXPOSE 80
CMD ["/usr/sbin/httpd", "-DFOREGROUND"]

