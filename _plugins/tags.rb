module Jekyll
    class TagsPage < Page
        def initialize(site, base, dir, tag)
            @site = site
            @base = base
            @dir = dir
            @tag = "#{tag}.html"

            self.process(@tag)
            self.read_yaml(base, 'index.md')
            self.data['title'] = "#{tag}"
            self.data['permalink'] = "/#{dir}/#{tag}.html"
            self.data['pages'] = []
            self.content = '{% include list.html pages=page.pages %}'

            site.posts.docs.each_entry do |post|
                if post.data['tags'].include? tag
                    self.data['pages'] << post
                end
            end
        end
    end

    class TagsPageGenerator < Generator
        safe true

        def generate(site)
            return
            dir = site.config['tags_dir']
            site.config['tags'].each_entry do |tag|
                site.pages << TagsPage.new(site, site.source, dir, tag) 
            end
        end
    end
end
