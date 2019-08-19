const patientModel = require('../models/PatientModel');
const featureModel = require('../models/FeatureModel');
const featureSectionModel = require('../models/FeatureSectionModel');
const moment = require('moment');

module.exports = {

    index: async function (req, res, next) {

        res.render('index', {
            title: '呼吸音視覺化'
        });
    },
    review: async function (req, res, next) {

        const patientId = req.query.patientId;
        const patient = await patientModel.findPatientById(patientId);

        res.render('review', {
            title: '呼吸音視覺化',
            patient: patient[0],
            today: moment().format('YYYY/MM/DD')
        });
    },
    findAllPatients: async function (req, res, next) {
        const patients = await patientModel.findAllPatients();
        res.json(patients);
    },
    getFeatures: async function (req, res, next) {

        const feature = req.query.feature;
        const patient_id = req.query.patient_id;
        const date = req.query.date;
        const last7Day = moment(date, 'YYYY/MM/DD').subtract('6', 'days').format('YYYY/MM/DD');
        const features = await featureModel.findFeatures(patient_id, last7Day, date, feature);
        res.json(features);
    },
    getFeatureSection: async function (req, res, next) {
        const feature_id = req.query.feature_id;
        const featureSection = await featureSectionModel.findFeatureSectionById(feature_id);
        res.json(featureSection);
    },
    getCaseByDayData: async function (req, res, next) {
        const feature = req.query.feature;
        const patient_id = req.query.patient_id;

        const caseByDayData = await featureModel.findSumByPatientAndFeature(patient_id, feature);
        res.json(caseByDayData);
    },
    getCaseByPartData: async function (req, res, next) {
        const feature = req.query.feature;
        const patient_id = req.query.patient_id;

        const caseByyPartData = await featureModel.findPartByPatientAndFeature(patient_id, feature);
        res.json(caseByyPartData);
    }

}
