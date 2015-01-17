angular
    .module 'cinApp'
    .service 'loaderService', ->
        class LoaderService
            constructor: ->
                @loading = no
                @counter = 0
            
            start: =>
                @counter++
                @loading = yes
                
            done: =>
                @counter-- if @counter > 0
                @loading = false if @counter is 0
        
        new LoaderService
                