module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      client: {
        src: ['public/client/*.js'],
        dest: 'public/client/client.js'
      }
    },

    mochaTest: {
      test: {
        options: {
          bail: true,
          reporter: 'spec' //nyan, xunit, html-cov, dot, min, markdown
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      clients: {
        files:{
          'public/dist/client.min.js' : ['public/client/client.js']
        }
      }
    },

    jshint: {
      files: [
      'public/client/*.js'
      //'public/lib/libs.js'
        // Add filespec list here
      ],
      options: {
        force: 'false',
        jshintrc: '.jshintrc',
        ignores: [
          'public/lib/**/*.js',
          'public/dist/**/*.js',
        ]
      }
    },

    cssmin: {
      style: {
        files: {
          'public/dist/style.min.css': 'public/style.css'
        }
      }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      },
      server: {
        files: [
          'server.js',
          'server-config.js'
        ]
      }
    },

    shell: {
      options: {
        stdout: true
      },
      prodServer: {
        command: [
          'git status',
          'git add .',
          'git commit -am "' + grunt.option('msg') +'"',
          'git push heroku master'
          ].join('&&')
        //can be used to auto-deploy to Heroku/Azure.
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
    //your code here
  ]);

  grunt.registerTask('build', [
    'jshint',
    'concat',
    'uglify',
    'cssmin'
    //your code here
  ]);

  grunt.registerTask('default', ['test', 'build'])

  //can be used to auto-deploy.
  grunt.registerTask('upload', function(n) {
    //Grunt options are ways to customize tasks.  Research ways to use them.
    if(grunt.option('prod')) {
      // add your production server task here
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', [
    'build',
    'shell'
    // add your deploy tasks here
  ]);


};
