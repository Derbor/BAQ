import { readFile, readdir } from 'fs'; // Modificado para incluir readdir
import path, { join } from 'path';
import { fileURLToPath } from 'url';
import { Client } from 'pg';
import { config } from 'dotenv';
config(); // Cargar variables de entorno desde .env



// Obtener __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const datosDirPath = join(__dirname, 'datos'); // Directorio donde están los CSV

readdir(datosDirPath, (err, files) => {
    if (err) {
        console.error('Error al leer el directorio de datos:', err);
        return;
    }

    const csvFiles = files.filter(file => file.toLowerCase().endsWith('.csv'));

    if (csvFiles.length === 0) {
        console.log('No se encontraron archivos CSV en el directorio de datos.');
        return;
    }

    csvFiles.forEach(csvFile => {
        const currentCsvFilePath = join(datosDirPath, csvFile);

        readFile(currentCsvFilePath, { encoding: 'utf-8' }, async (err, data) => {
            if (err) {
                console.error(`Error al leer el archivo CSV ${csvFile}:`, err);
                return; // Continuar con el siguiente archivo si uno falla
            }

            const lines = data.split('\n');
            if (lines.length === 0) {
                console.log(`El archivo CSV ${csvFile} está vacío.`);
                return;
            }

            const headers = lines[0].split('|').map(header => header.trim());
            const dataLines = lines.slice(1); // Tomar todas las líneas de datos después del encabezado

            const desiredHeaders = ['NUMERO_RUC', 'RAZON_SOCIAL', 'TIPO_CONTRIBUYENTE', 'CODIGO_JURISDICCION'];

            const jsonResult = dataLines.map(line => {
                const values = line.split('|').map(value => value.trim());
                const entry = {};
                headers.forEach((header, index) => {
                    if (desiredHeaders.includes(header)) {
                        // Asegurarse de que values[index] exista para evitar errores
                        entry[header] = values.length > index ? values[index] : undefined;
                    }
                });
                if (entry['TIPO_CONTRIBUYENTE'] === 'PERSONA NATURAL' && entry['NUMERO_RUC'] && entry['NUMERO_RUC'].length === 13) {
                    entry['NUMERO_RUC'] = entry['NUMERO_RUC'].slice(0, 10);
                }
                return entry;
            }).filter(entry => {
                return Object.keys(entry).length > 0 && desiredHeaders.some(header => entry[header] !== undefined && entry[header] !== '');
            });

            if (jsonResult.length > 0) {
                console.log(`Resultados del archivo ${csvFile} (solo campos seleccionados):`);

                // Usar una cadena de conexión si está definida, de lo contrario, usar configuración detallada
                const connectionConfig = process.env.DATABASE_URL ?
                    { connectionString: process.env.DATABASE_URL } :
                    {
                        host: process.env.HOST,
                        port: process.env.PORT,
                        user: process.env.USER,
                        password: process.env.PASSWORD,
                        database: process.env.DBNAME,
                    };

                const client = new Client(connectionConfig);

                try {
                    await client.connect();
                    const batchSize = 500; // Insertar en lotes de 500 registros (500 * 4 = 2000 parámetros)
                    let totalAttemptedForFile = 0;

                    for (let i = 0; i < jsonResult.length; i += batchSize) {
                        const batch = jsonResult.slice(i, i + batchSize);
                        if (batch.length === 0) {
                            continue;
                        }

                        const batchValues = [];
                        const batchPlaceholders = [];
                        let placeholderIndex = 1;

                        batch.forEach(entry => {
                            batchPlaceholders.push(`($${placeholderIndex++}, $${placeholderIndex++}, $${placeholderIndex++}, $${placeholderIndex++})`);
                            batchValues.push(
                                entry.NUMERO_RUC,
                                entry.RAZON_SOCIAL,
                                entry.CODIGO_JURISDICCION,
                                'SRI' // fuente
                            );
                        });

                        if (batchValues.length === 0) {
                            continue;
                        }

                        const query = `
                            INSERT INTO personas_identificadas (
                                numero_identificacion,
                                nombre_completo,
                                provincia,
                                fuente
                            ) VALUES ${batchPlaceholders.join(', ')}
                            ON CONFLICT (numero_identificacion) DO NOTHING
                        `;

                        try {
                            await client.query(query, batchValues);
                            console.log(`Lote de ${batch.length} registros procesado para inserción desde ${csvFile}.`);
                            totalAttemptedForFile += batch.length;
                        } catch (batchErr) {
                            console.error(`Error al insertar lote desde ${csvFile}:`, batchErr);
                            // Decidir si continuar con el siguiente lote o detenerse para este archivo
                            break; 
                        }
                    }
                    console.log(`Total de ${totalAttemptedForFile} registros procesados para inserción desde ${csvFile}. (Nota: 'ON CONFLICT DO NOTHING' puede resultar en menos inserciones reales)`);

                } catch (connectErr) {
                    console.error(`Error de conexión o procesamiento general para ${csvFile}:`, connectErr);
                } finally {
                    if (client) {
                        await client.end();
                    }
                }

                // console.log(JSON.stringify(jsonResult, null, 2)); // Comentado como en tu versión
            } else {
                console.log(`No se encontraron datos relevantes en ${csvFile} con los filtros aplicados.`);
            }
        });
    });
});
