import fs from 'fs';
import path from 'path';

const name = process.argv[2];
if (!name) {
  process.exit(1);
}

const root = path.join(process.cwd(), 'src', 'features', name);
const dirs = ['controller', 'service', 'model', 'route', 'dto', 'validation', 'type'];
dirs.forEach((d) => fs.mkdirSync(path.join(root, d), { recursive: true }));

const write = (p: string, c: string) => fs.writeFileSync(p, c);

write(
  path.join(root, 'index.ts'),
  [
    `export * from './controller/${name}.controller';`,
    `export * from './service/${name}.service';`,
    `export * from './model/${name}.model';`,
    `export * from './route/${name}s.routes';`,
    `export * from './type/${name}.type';`,
    `export * from './dto/${name}.dto';`,
    `export * from './validation/${name}.validations';`,
  ].join('\n'),
);

write(path.join(root, 'controller', `${name}.controller.ts`), `export {};`);
write(path.join(root, 'service', `${name}.service.ts`), `export {};`);
write(path.join(root, 'model', `${name}.model.ts`), `export {};`);
write(path.join(root, 'route', `${name}s.routes.ts`), `export {};`);
write(path.join(root, 'dto', `${name}.dto.ts`), `export {};`);
write(path.join(root, 'validation', `${name}.validations.ts`), `export {};`);
write(path.join(root, 'type', `${name}.type.ts`), `export {};`);

console.log('done');
