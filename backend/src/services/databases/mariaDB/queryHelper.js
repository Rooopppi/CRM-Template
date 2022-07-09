import _ from 'lodash';
import MariaDBFieldTypes from './dataTypes.js';

class MariaDBQueryHelper {
  #connector;
  constructor(connector) {
    this.#connector = connector;
  }

  #transformSearchMode = (mode) => {
    switch (mode) {
      case 'EQ':
        return '=';
      case 'GT':
        return '>';
      case 'GET':
        return '>=';
      case 'LT':
        return '<';
      case 'LET':
        return '<=';
      case 'LE':
        return 'LIKE';
      case 'NEQ':
        return '!=';
      case 'NE':
        return '!=""';
      default:
    }
  };

  #transformFieldType = (fieldType) => MariaDBFieldTypes[fieldType];

  /**
   * Function to build create table fields SQL query block
   * @param  {[]} fields will be array of the fields (string) you want to insert into table (see createTable).
   */
  #createTableFields = (table, fields) => {
    const fieldStrings = _.map(
      fields,
      ({
        name,
        type,
        isNotNull = true,
        defaultValue = 'NULL',
        foreignKey,
        primaryKey
      }) => {
        const convertedFieldType = this.#transformFieldType(type);
        const isFieldNullable = isNotNull ? 'NOT NULL' : 'NULL';
        const fieldCreateBlock = `\`${name}\` ${convertedFieldType} ${isFieldNullable} ${defaultValue}`;
        const foreignKeyFieldBlock = foreignKey
          ? `CONSTRAINT \`FK__${table}_${name}\` FOREIGN KEY (\`${name}\`) REFERENCES \`${foreignKey.table}\` (\`${foreignKey.field}\`) ON UPDATE NO ACTION ON DELETE NO ACTION`
          : null;

        const primaryKeyFieldBlock = primaryKey
          ? `PRIMARY KEY (\`${name}\`)`
          : null;

        const fieldBuiltStrings = [fieldCreateBlock];

        if (foreignKeyFieldBlock) {
          fieldBuiltStrings.push(foreignKeyFieldBlock);
        }
        if (primaryKeyFieldBlock) {
          fieldBuiltStrings.push(primaryKeyFieldBlock);
        }

        return _.join(fieldBuiltStrings, ',\r\n');
      }
    );
    return `(\r\n${_.join(fieldStrings, ',\r\n')}\r\n)`;
  };

  #buildFieldsQuery = (tableName, fields) => {
    const isMultipleTablesQuery = _.some(
      _.keys(fields),
      (fieldKey) => typeof fields[fieldKey] === 'object'
    );
    if (isMultipleTablesQuery) {
      return this.#buildMultipleTablesFieldsQuery(fields);
    }
    return this.#buildSingleTableFieldsQuery(tableName, fields);
  };

  #buildMultipleTablesFieldsQuery = (fields) => {
    const fieldsKeys = _.keys(fields);
    const fieldsStatement = _.map(fieldsKeys, (fieldKey) => {
      const query = _.transform(fields[fieldKey], (result, value, key) => {
        (result.asset || (result.asset = [])).push(`${fieldKey}.\`${value}\``);
      }).asset;
      return _.join(query, ', ');
    });
    const fieldsQueryString = `${_.join(fieldsStatement, ', ')}`;
    return fieldsQueryString;
  };

  /**
   * Function to build fields SQL query block
   * @param  {[]} fields will be array of the fields (string) you want to select as they represented on database table.
   */
  #buildSingleTableFieldsQuery = (tableName, fields = []) => {
    if (!_.size(fields)) {
      return '*';
    }
    const fieldsQueryString = `${tableName}.\`${_.join(
      fields,
      `\`, ${tableName}.\``
    )}\``;
    return fieldsQueryString;
  };

  /**
   * Function to build VALUES SQL query block
   * @param  {[]} fields will be array of the field values (string) you want to set to database table.
   */
  #buildValuesQuery = (fields = []) => {
    const fieldsQueryString = `${_.join(fields, ', ')}`;
    return fieldsQueryString;
  };

  #buildWhereStatement = ({
    tableName,
    fieldName,
    mode = 'EQ',
    fieldValue
  }) => {
    const isString = typeof fieldValue === 'string';
    const requestValue = isString ? `'${fieldValue}'` : fieldValue;

    const clause = `${tableName}.\`${fieldName}\`${this.#transformSearchMode(
      mode
    )}${requestValue}`;
    return clause;
  };

  #buildSubWhereQuery = ({ method, cases }) => {
    const casesAsStrings = _.map(cases, (singleCase) => {
      if (singleCase?.method) {
        return this.#buildSubWhereQuery(singleCase);
      }
      return this.#buildWhereStatement(singleCase);
    });
    const resultString = _.join(casesAsStrings, ` ${method} `);

    const allHasMethod = _.every(cases, (singleCase) => singleCase?.cases);
    const allNotHasMethod = _.every(cases, (singleCase) => !singleCase?.cases);

    const isGrouped = allHasMethod || allNotHasMethod;

    if (isGrouped) {
      return `(${resultString})`;
    }
    return resultString;
  };

  /**
   * Function to build where closure of the SQL query
   * @param  {[]} where will be array of the objects of conditions.
   *
   * Example {fieldName: 'name', fieldValue: 'Joe', mode: 'EQ'} will create SQL name='Joe'
   */
  #buildWhereQuery = (where) => {
    if (!where) {
      return '';
    }
    if (where?.method) {
      return ` WHERE ${this.#buildSubWhereQuery(where)}`;
    }
    return ` WHERE ${this.#buildWhereStatement(where)}`;
  };

  /**
   * Function to build ORDER SQL query block
   * @param  {[]} order will be array of the order objects you want to sort your results by.
   *
   * Example {field: 'name', order: 'DESC'} will create SQL name DESC
   */
  #buildOrderQuery = (tableName, order) => {
    if (!order) {
      return '';
    }
    const orderKeys = _.keys(order);
    const orderStatement = _.map(orderKeys, (orderKey) => {
      if (_.keys(order[orderKey]).length === 2) {
        tableName = order[orderKey].tableName;
        delete order[orderKey].tableName;
      }
      const query = _.transform(order[orderKey], (result, value, key) => {
        (result.asset || (result.asset = [])).push(
          `${tableName}.\`${key}\` ${value}`
        );
      }).asset;
      return _.join(query, ',');
    });

    const orderQuery = `ORDER BY ${_.join(orderStatement, ', ')}`;
    return orderQuery;
  };

  /**
   * Function to build SET SQL query block
   * @param  {[]} fields will be array of the set objects you want to update your table with.
   *
   * Example {name: 'John'} will create SQL name='John'
   */
  #buildSetQuery = (fields = []) => {
    const fieldKeys = _.keys(fields);

    const setQueryStatements = _.map(fieldKeys, (fieldKey) => {
      const fieldValue = fields[fieldKey];
      const isString = typeof fieldValue === 'string';
      const isObject = typeof fieldValue === 'object';
      if (!isObject) {
        return isString
          ? `\`${fieldKey}\`='${fieldValue}'`
          : `\`${fieldKey}\`=${fieldValue}`;
      }
      return `${fieldKey}='${JSON.stringify(fieldValue)}'`;
    });
    const setQuery = `${_.join(setQueryStatements, ', ')}`;
    return setQuery;
  };

  /**
   * Function to build LIMIT SQL query block
   * @param  {number} limit any number from 1. Will indicate your result set maximum size
   *
   */
  #buildLimitQuery = (limit) => {
    if (!limit) {
      return '';
    }
    return `LIMIT ${limit}`;
  };

  /**
   * Function to build INSERT columns SQL query block
   * @param  {[]} columns array (string) of columns you are going to supply with data during INSERT
   */
  #buildInsertColumns = (columns) => {
    return _.keys(columns);
  };

  /**
   * Function to build INSERT VALUES SQL query block
   * @param  {[]} columns array (string) of values you are going to supply on columns
   */
  #buildInsertValues = (values) => {
    return _.map(_.values(values), (value) => {
      switch (typeof value) {
        case 'string':
          return `'${value}'`;
        case 'object':
          return `'${JSON.stringify(value)}'`;
        default:
      }
      return value;
    });
  };

  /**
   * Function to build JOIN SQL query block
   * @param  {[]} join array (object) of join statements
   *
   * Example: join = [ {"tableName": "groups", "condition": "users.id=groups.id", "type": "INNER"}]
   */
  #buildJoinQuery = (join) => {
    if (!join) {
      return '';
    }
    const query = _.transform(join, (result, joinObject) => {
      const { tableName, condition, type } = joinObject;
      (result.asset || (result.asset = [])).push(
        ` ${type} JOIN ${tableName} ON ${condition}`
      );
    }).asset;

    const joinQuery = `${_.join(query, ' ')}`;
    return joinQuery;
  };

  /**
   * Function to provide backend logs for mysql
   * @param  {boolean} debug if true, current SQL Query will be printed
   * @param  {string} generatedSQLString the SQL Query will be printed
   */
  #debugSQL = (debug, generatedSQLString) => {
    if (debug) console.log(generatedSQLString);
  };

  /**
   * Function to execute SQL query string
   * @param  {string} sqlQueryString SQL query string
   * @param  {boolean} debug if set to true, SQL Query string will be printed
   *
   *
   * @returns {object} for write operations returns only stats, for read returns data object
   */
  #executeQuery = async (sqlQueryString, debug) => {
    this.#debugSQL(debug, sqlQueryString);
    try {
      const queryResult = await this.#connector.sendQuery(sqlQueryString);
      const parsedQueryResult = JSON.parse(JSON.stringify(queryResult));
      return parsedQueryResult;
    } catch (error) {
      return error.message;
    }
  };

  /**
   * Function to execute search over table
   * @param  {string} tableName table to make requests from
   * @param  {[]} fields array (string) of fields to be selected
   * @param  {[] | null} where array (object) of where statements { fieldName: 'name' , fieldValue: 'John', mode: 'EQ' }
   * @param  {[] | null} order array (object) of order statements { field: 'name', order: 'DESC' }
   * @param  {number | null} limit number of maximum length of query result
   * @param  {boolean | null} debug if true will provide generated SQL string on logs
   *
   * @returns {object} will return you object presentation of result
   */
  async select(tableName, fields, where, order, limit, join, debug = false) {
    const selectQuery = this.#buildFieldsQuery(tableName, fields);
    const whereQuery = this.#buildWhereQuery(where);
    const orderQuery = this.#buildOrderQuery(tableName, order);
    const limitQuery = this.#buildLimitQuery(limit);
    const joinQuery = this.#buildJoinQuery(join);

    const sqlQueryString = `SELECT ${selectQuery} FROM ${tableName}${joinQuery}${whereQuery} ${orderQuery} ${limitQuery};`;

    const selectQueryResult = await this.#executeQuery(sqlQueryString, debug);
    return selectQueryResult;
  }

  /**
   * Function to insert into a table
   * @param  {string} tableName table to insert data
   * @param  {[]} fields array (object) of fields to be inserted { name: 'Joe' }
   * @param  {boolean | null} debug if true will provide generated SQL string on logs
   *
   * @returns {object} will return you object presentation of result
   */
  async insert(tableName, fields, debug) {
    const columns = this.#buildInsertColumns(fields);
    const values = this.#buildInsertValues(fields);
    const columnQuery = this.#buildFieldsQuery(tableName, columns);
    const valuesQuery = this.#buildValuesQuery(values);

    const sqlQueryString = `INSERT INTO ${tableName}(${columnQuery}) VALUES (${valuesQuery});`;
    const selectQueryResult = await this.#executeQuery(sqlQueryString, debug);
    return selectQueryResult;
  }

  /**
   * Function to update a table
   * @param  {string} tableName table to update data
   * @param  {[]} fields array (object) of fields to be updated { name: 'Joe' }
   * @param  {[]} where array (object) of where statements { fieldName: 'name' , fieldValue: 'John', mode: 'EQ' }
   * @param  {boolean | null} debug if true will provide generated SQL string on logs
   *
   * @returns {object} will return you object presentation of result
   */
  async update(tableName, fields, where, debug) {
    const setQuery = this.#buildSetQuery(fields);
    const whereQuery = this.#buildWhereQuery(where);

    const sqlQueryString = `UPDATE ${tableName} SET ${setQuery} ${whereQuery};`;

    const selectQueryResult = await this.#executeQuery(sqlQueryString, debug);
    return selectQueryResult;
  }

  /**
   * Function to remove row from table
   * @param  {string} tableName table to remove data
   * @param  {[]} where array (object) of where statements { fieldName: 'name' , fieldValue: 'John', mode: 'EQ' }
   * @param  {boolean | null} debug if true will provide generated SQL string on logs
   *
   * @returns {object} will return you object presentation of result
   */
  async delete(tableName, where, debug) {
    const whereQuery = this.#buildWhereQuery(where);

    const sqlQueryString = `DELETE FROM ${tableName} ${whereQuery};`;

    const selectQueryResult = await this.#executeQuery(sqlQueryString, debug);
    return selectQueryResult;
  }

  /**
   * Function to create data base
   * @param  {string} dataBaseName name of new data base
   * @param  {boolean | null} debug if true will provide generated SQL string on logs
   *
   * @returns {object} will return you object presentation of result
   */
  async createDataBase(dataBaseName, debug) {
    const sqlCreateQueryString = `CREATE DATABASE \`${dataBaseName}\``;

    const sqlCreateResult = await this.#executeQuery(
      sqlCreateQueryString,
      debug
    );
    return sqlCreateResult;
  }

  /**
   * Function to drop data base
   * @param  {string} dataBaseName name of the data base will be removed
   * @param  {boolean | null} debug if true will provide generated SQL string on logs
   *
   * @returns {object} will return you object presentation of result
   */
  async dropDataBase(dataBaseName, debug) {
    const sqlDropQueryString = `DROP DATABASE \`${dataBaseName}\``;

    const sqlDropResult = await this.#executeQuery(sqlDropQueryString, debug);
    return sqlDropResult;
  }

  /**
   * Function to ALTER (move) data base
   * @param  {string} oldDataBaseName name of old data base
   * @param  {string} newDataBaseName name of new data base
   * @param  {boolean | null} debug if true will provide generated SQL string on logs
   *
   * @returns {void} nothing to return
   */
  async alterDataBase(oldDataBaseName, newDataBaseName, debug) {
    await this.createDataBase(newDataBaseName, debug);

    const sqlDataBaseTablesResults = await this.#executeQuery(
      `SHOW TABLE STATUS FROM \`${oldDataBaseName}\`;`,
      debug
    );
    _.each(sqlDataBaseTablesResults, async ({ Name }) => {
      await this.#executeQuery(
        `RENAME TABLE \`${oldDataBaseName}\`.\`${Name}\` TO \`${newDataBaseName}\`.\`${Name}\`;`,
        debug
      );
    });

    await this.dropDataBase(oldDataBaseName, debug);
  }

  /**
   * Function to switch scope to data base
   * @param  {string} dataBaseName name of old data base
   * @param  {boolean | null} debug if true will provide generated SQL string on logs
   *
   * @returns {void} nothing to return
   */
  async useDataBase(dataBaseName, debug) {
    await this.#executeQuery(`USE \`${dataBaseName}\`;`, debug);
  }

  /**
   * Function to create table
   * @param  {string} tableName name of the new table
   * @param  {fields} fields array of fields objects to be supplied to the table
   *
   * {
   * name: 'id',
   * type: dataTypes.bigInteger,
   * isNotNull: true,
   * defaultValue: 'AUTO_INCREMENT',
   * primaryKey: true,
   * foreignKey:
   *  {
   *    table: 'users',
   *    field: 'id'
   *  }
   * }
   * @param  {boolean | null} debug if true will provide generated SQL string on logs
   *
   * @returns {object} will return you object presentation of result
   */

  async createTable(tableName, fields, debug) {
    const createFieldsQueryString = this.#createTableFields(tableName, fields);
    const createTableQueryString = `CREATE TABLE \`${tableName}\` ${createFieldsQueryString} COLLATE='utf8mb4_general_ci';`;
    const createResults = await this.#executeQuery(
      createTableQueryString,
      debug
    );
    return createResults;
  }

  /**
   * Function to drop table
   * @param  {string} tableName name of the table will be removed
   * @param  {boolean | null} debug if true will provide generated SQL string on logs
   *
   * @returns {object} will return you object presentation of result
   */
  async dropTable(tableName, debug) {
    const dropTableQueryString = `DROP TABLE \`${tableName}\``;
    await this.#executeQuery(dropTableQueryString, debug);
  }
  // TBD: Allow multi-table/db selecting (joins), allow on order only 2 modes, add more security to fields and request
}

export default MariaDBQueryHelper;
