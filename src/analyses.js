export const ANALYSES = {
  basic_clinic: {
    label: "Basic Clinic Analysis",
    files: {
      patients: {
        required_columns: [
          "patientid",
          "zip",
          "dob",
          "city",
          "state",
        ],
      },
      visits: {
        required_columns: [
          "patientid",
          "visitdate",
          "service",
          "servicecharge",
          "serviceduration",
        ],
      },
      metrics: {
        required_columns: [
          "patientid",
          "metricdate",
          "painscore",
          "mobilityscore",
        ],
      },
    },
  },
};
