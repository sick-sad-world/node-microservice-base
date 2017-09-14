const DBSTR = "mongodb://nodeproject:7xz9ogf1@localhost:27017/nodeproject";
const JWTSEED = 'NFbEHd0Oteu4KQh';
const JWTKEY = 'EKZ2btKN';

module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [
    {
      name : "Gate",
      cwd: "gate",
      script : "bin/www",
      ignore_watch: ["node_modules"],
      watch	: true,
      env: {
        DBSTR: DBSTR,
        JWTSEED: JWTSEED,
        JWTKEY: JWTKEY,
        NODE_ENV: "development"
      },
      env_production : {
        NODE_ENV: "production"
      }
    },
    {
      name : "Users",
      cwd: "users",
      script : "bin/www",
      ignore_watch: ["node_modules"],
      watch	: true,
      env: {
        DBSTR: DBSTR,
        JWTSEED: JWTSEED,
        JWTKEY: JWTKEY,
        NODE_ENV: "development"
      },
      env_production : {
        NODE_ENV: "production"
      }
    }
    // {
    //   name : "Frontend",
    //   cwd: "frontend",
    //   script : "bin/www",
    //   ignore_watch: ["node_modules", "public", "production"],
    //   watch	: true,
    //   env: {
    //     NODE_ENV: "development"
    //   },
    //   env_production : {
    //     NODE_ENV: "production"
    //   }
    // },
    // {
    //   name : "Story parser",
    //   cwd: "story-parser",
    //   script : "bin/www",
    //   ignore_watch: ["node_modules"],
    //   watch	: true,
    //   instances: 10,
    //   env: {
    //     NODE_ENV: "development"
    //   },
    //   env_production : {
    //     NODE_ENV: "production"
    //   }
    // }
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy : {
    // production : {
    //   user : "node",
    //   host : "212.83.163.1",
    //   ref  : "origin/master",
    //   repo : "git@github.com:repo.git",
    //   path : "/var/www/production",
    //   "post-deploy" : "npm install && pm2 startOrRestart ecosystem.json --env production"
    // },
    // dev : {
    //   user : "node",
    //   host : "212.83.163.1",
    //   ref  : "origin/master",
    //   repo : "git@github.com:repo.git",
    //   path : "/var/www/development",
    //   "post-deploy" : "npm install && pm2 startOrRestart ecosystem.json --env dev",
    //   env  : {
    //     NODE_ENV: "dev"
    //   }
    // }
  }
}
