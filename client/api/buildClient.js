import axios from 'axios';

const buildClient = ({ req }) => {
  if (typeof window === 'undefined') {
    // Server
    const service = `ingress-nginx-controller`;
    const namespace = `ingress-nginx`;
    const ingressUrl = `http://${service}.${namespace}.svc.cluster.local`;
    return axios.create({
      baseURL: ingressUrl,
      headers: req.headers,
    });
  } else {
    // Browser
    return axios.create({ baseURL: `/` });
  }
};

export default buildClient;
