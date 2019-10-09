export default {
  data () {
    return {
      fallbackAddress: '0x0000000000000000000000000000000000000001',
    };
  },
  methods: {
    getParam (param) {
      const vars = {};
      window.location.href.replace(location.hash, '').replace(
        /[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
        function (m, key, value) { // callback
          vars[key] = value !== undefined ? value : '';
        }
      );

      if (param) {
        return vars[param] ? vars[param] : null;
      }
      return vars;
    },
    promisify (fn, ...args) {
      args.push({ from: this.fallbackAddress });

      return new Promise((resolve, reject) => {
        fn(...args, (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        });
      });
    },
    print () {
      window.print();
    },
  },
};
