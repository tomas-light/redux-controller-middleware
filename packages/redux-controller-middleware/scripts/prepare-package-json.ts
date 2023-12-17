import { readdir, writeFile, readFile } from 'fs/promises';
import path from 'path';

const buildDir = '../dist';

async function copyReadme() {
  const readmeContent = await readFile(path.join('README.md'), 'utf-8');
  await writeFile(path.join(buildDir, 'README.md'), readmeContent);
}
async function copyLicense() {
  const readmeContent = await readFile(path.join('LICENSE'), 'utf-8');
  await writeFile(path.join(buildDir, 'LICENSE'), readmeContent);
}

async function copyAndFixPackageJson() {
  const sourcePackageJsonString = await readFile(path.join('package.json'), 'utf-8');
  const sourcePackageJson = JSON.parse(sourcePackageJsonString);

  const modifiedPackageJson = {
    ...sourcePackageJson,
    ...sourcePackageJson['build-instructions'],
  };
  delete modifiedPackageJson['build-instructions'];
  delete modifiedPackageJson['devDependencies'];
  delete modifiedPackageJson['scripts'];

  const modifiedPackageJsonString = JSON.stringify(modifiedPackageJson, null, 2);
  await writeFile(path.join(buildDir, 'package.json'), modifiedPackageJsonString);
}

async function createEsmModulePackageJson() {
  const directories = await readdir(buildDir);

  const directoryTypeMap = {
    cjs: 'commonjs',
    esm: 'module',
  };
  const keys = Array.from(Object.keys(directoryTypeMap));

  for await (const directory of directories) {
    if (keys.includes(directory)) {
      const packageJsonFilePath = path.join(buildDir, directory, 'package.json');

      const content = JSON.stringify(
        {
          type: directoryTypeMap[directory as keyof typeof directoryTypeMap],
        },
        null,
        2
      );
      await writeFile(packageJsonFilePath, content);
    }
  }
}

(async () => {
  await copyReadme();
  await copyLicense();
  await copyAndFixPackageJson();
  await createEsmModulePackageJson();
})();
