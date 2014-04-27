Package.describe({
  summary: "Bulk insert/update/delete documents in a collection",
  environments: ['server']
});

Package.on_use(function (api) {
  where = 'server';
  api.add_files('lib/bulkCollectionUpdate.js', where);
  api.export && api.export('bulkCollectionUpdate', where);
});
